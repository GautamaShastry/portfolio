"""Conversation transcripts: every chatbot / voice-agent turn is saved to Supabase, and
when a visitor's conversation ends the full transcript is emailed to the site owner via Amazon SES.

"Ends" means either the browser reports it (chat closed or page left, POST
/api/conversations/end) or the scheduled sweep finds the session idle (send_pending_transcripts,
run by an EventBridge rule - see main.handler). The email content always comes from the
database, never from the request, so nobody can use this endpoint to send arbitrary mail.

Each email starts with a lead summary (who the visitor was, what they want - leads.py). A
recruiter or hiring manager who left their email also gets a confirmation (mailer.py)."""
import html
import json
import os
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from leads import VISITOR_LABELS, extract_lead, lead_headline
from owner import OWNER_FIRST_NAME, OWNER_NAME
from mailer import NOTIFY_EMAIL, SITE_URL, is_valid_email, record_contact, send_acknowledgment, send_email
from rate_limit import rate_limiter
from supabase_client import get_supabase_client

router = APIRouter()

IDLE_MINUTES = int(os.getenv("TRANSCRIPT_IDLE_MINUTES", "15"))

CHANNEL_LABELS = {"chat": "Chatbot", "voice": "Voice agent"}


def parse_session_id(value: str | None) -> str | None:
    try:
        return str(uuid.UUID(value)) if value else None
    except (ValueError, TypeError):
        return None


def log_turn(session_id: str | None, channel: str, language: str, question: str, answer: str) -> None:
    """Best effort: a logging failure must never break the visitor's chat."""
    session_id = parse_session_id(session_id)
    if not session_id:
        return
    try:
        get_supabase_client().rpc("log_chat_turn", {
            "p_session_id": session_id,
            "p_channel": channel,
            "p_language": language,
            "p_user": question,
            "p_assistant": answer,
        }).execute()
    except Exception as e:
        print(f"Transcript log error: {e!r}")


def _load_messages(session_id: str) -> list[dict]:
    result = (
        get_supabase_client().table("chat_messages")
        .select("channel,language,role,content,created_at")
        .eq("session_id", session_id)
        .order("id")
        .execute()
    )
    return result.data or []


def _format_time(value: str) -> str:
    try:
        return datetime.fromisoformat(value).astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    except (ValueError, TypeError):
        return value or ""


def _lead_block(lead: dict | None) -> tuple[list[str], str]:
    """Text lines and HTML for the lead summary at the top of the transcript email."""
    if not lead:
        return [], ""
    fields = [
        ("Visitor", VISITOR_LABELS.get(lead.get("visitor_type"), "Visitor")),
        ("Name", lead.get("name")),
        ("Company", lead.get("company")),
        ("Role", lead.get("role")),
        ("Email", lead.get("email")),
        ("Summary", lead.get("summary")),
        ("Suggested next step", lead.get("next_step")),
    ]
    fields = [(k, v) for k, v in fields if v]
    text = ["--- Lead summary ---"] + [f"{k}: {v}" for k, v in fields] + ["--------------------", ""]
    rows = "".join(
        f'<tr><td style="padding:3px 12px 3px 0;color:#666;vertical-align:top;white-space:nowrap">{html.escape(k)}</td>'
        f"<td style=\"padding:3px 0\">{html.escape(str(v))}</td></tr>"
        for k, v in fields
    )
    block = (
        '<div style="border:1px solid #e9d5ff;background:#faf5ff;border-radius:8px;padding:12px 14px;margin:12px 0">'
        f'<div style="font-weight:bold;margin-bottom:6px">Lead summary</div><table style="font-size:14px">{rows}</table></div>'
    )
    return text, block


def _build_email(session_id: str, messages: list[dict], lead: dict | None = None) -> tuple[str, str, str]:
    questions = [m for m in messages if m["role"] == "user"]
    first_question = questions[0]["content"] if questions else ""
    snippet = first_question[:60] + ("..." if len(first_question) > 60 else "")
    channels = sorted({CHANNEL_LABELS.get(m["channel"], m["channel"]) for m in messages})
    languages = sorted({m.get("language") or "en" for m in messages})
    started = _format_time(messages[0]["created_at"])

    headline = lead_headline(lead)
    subject = (
        f"Portfolio conversation - {headline}" if headline
        else f"Portfolio conversation: \"{snippet}\" ({len(questions)} question{'s' if len(questions) != 1 else ''})"
    )
    meta = f"Started: {started} | Via: {', '.join(channels)} | Language: {', '.join(languages)} | Session: {session_id}"

    lead_text, lead_html = _lead_block(lead)
    text_lines = ["Someone talked to the AI assistant on your portfolio.", meta, ""] + lead_text
    html_rows = []
    for m in messages:
        who = "Visitor" if m["role"] == "user" else "Assistant"
        text_lines.append(f"[{_format_time(m['created_at'])}] {who}: {m['content']}\n")
        bg = "#f3e8ff" if m["role"] == "user" else "#f5f5f5"
        html_rows.append(
            f'<div style="background:{bg};border-radius:8px;padding:10px 12px;margin:8px 0">'
            f'<div style="font-size:12px;color:#666">{who} &middot; {html.escape(_format_time(m["created_at"]))}</div>'
            f'<div style="white-space:pre-wrap">{html.escape(m["content"])}</div></div>'
        )
    html_body = (
        '<div style="font-family:Arial,sans-serif;max-width:640px">'
        "<h2 style=\"margin-bottom:4px\">New portfolio conversation</h2>"
        f'<p style="color:#666;font-size:13px">{html.escape(meta)}</p>'
        + lead_html
        + "".join(html_rows)
        + "</div>"
    )
    return subject, "\n".join(text_lines), html_body


def email_transcript(session_id: str) -> bool:
    """Email the session's transcript if it has unsent messages. Returns True if sent."""
    if not NOTIFY_EMAIL:
        print("TRANSCRIPT_NOTIFY_EMAIL not set - skipping transcript email")
        return False
    supabase = get_supabase_client()
    claimed = supabase.rpc("claim_session_for_email", {"p_session_id": session_id}).execute().data
    if not claimed:
        return False
    return _send_claimed(session_id)


def _acknowledge_chat_lead(session_id: str, lead: dict | None) -> None:
    """A recruiter / hiring manager who left their email gets the confirmation email, once."""
    if not lead or not lead.get("email") or lead.get("visitor_type") not in ("recruiter", "hiring_manager"):
        return
    try:
        already = (
            get_supabase_client().table("contact_messages").select("id")
            .eq("session_id", session_id).eq("email", lead["email"].lower()).limit(1).execute().data
        )
        if already:
            return
        contact_id = record_contact("chat", lead["email"], lead.get("name"), lead.get("summary"), session_id)
        send_acknowledgment(contact_id, lead["email"], lead.get("name"), "chat")
    except Exception as e:
        print(f"Chat acknowledgment error for {session_id}: {e!r}")


def _send_claimed(session_id: str) -> bool:
    messages = _load_messages(session_id)
    if not messages:
        return False
    lead = extract_lead(messages)  # best effort: None if it fails
    if lead:
        try:
            get_supabase_client().table("chat_sessions").update({"lead": lead}).eq("id", session_id).execute()
        except Exception as e:
            print(f"Saving lead failed for {session_id}: {e!r}")
    try:
        send_email(NOTIFY_EMAIL, *_build_email(session_id, messages, lead),
                   reply_to=(lead or {}).get("email"))
        _acknowledge_chat_lead(session_id, lead)
        return True
    except Exception as e:
        print(f"Transcript email error for {session_id}: {e!r}")
        # Release the claim so the scheduled sweep retries this session later.
        get_supabase_client().table("chat_sessions").update({"emailed_at": None}).eq("id", session_id).execute()
        return False


def send_pending_transcripts() -> dict:
    """Run by the scheduled EventBridge rule: email every conversation that went idle
    without the browser reporting its end (closed tab, crashed browser, ...)."""
    if not NOTIFY_EMAIL:
        return {"sent": 0, "reason": "TRANSCRIPT_NOTIFY_EMAIL not set"}
    rows = get_supabase_client().rpc("claim_idle_sessions", {"idle_minutes": IDLE_MINUTES}).execute().data or []
    # PostgREST returns a set of scalars either bare or wrapped as {"claim_idle_sessions": ...}
    session_ids = [r["claim_idle_sessions"] if isinstance(r, dict) else r for r in rows]
    sent = sum(1 for sid in session_ids if _send_claimed(sid))
    return {"sent": sent, "claimed": len(session_ids)}


@router.post(
    "/api/conversations/end",
    status_code=204,
    dependencies=[Depends(rate_limiter("conversation-end", limit=10, window_seconds=600))],
)
async def end_conversation(request: Request):
    # Sent with navigator.sendBeacon as text/plain (no CORS preflight), so parse by hand.
    try:
        payload = json.loads(await request.body() or b"{}")
    except (ValueError, UnicodeDecodeError):
        payload = {}
    session_id = parse_session_id(payload.get("session_id") if isinstance(payload, dict) else None)
    if session_id:
        try:
            await run_in_threadpool(email_transcript, session_id)
        except Exception as e:
            print(f"End conversation error: {e!r}")
    return None


# --- A copy of the conversation for the visitor ---------------------------------------------
# The assistant offers it (tool call -> confirmation card); this endpoint runs only after the
# visitor confirms the address in that card. The content comes from the database, the visitor
# can get one copy per conversation, and one address at most 3 copies a day, so it can't be
# used to mail arbitrary people repeatedly.
MAX_COPIES_PER_ADDRESS_PER_DAY = 3


class ConversationCopyRequest(BaseModel):
    session_id: str
    email: str


def _build_visitor_copy(messages: list[dict]) -> tuple[str, str, str]:
    subject = f"Your conversation with {OWNER_NAME}'s AI assistant"
    started = _format_time(messages[0]["created_at"])
    intro = f"Here's a copy of your conversation on {SITE_URL.replace('https://', '')} ({started})."
    footer = (
        f"Want to reach {OWNER_FIRST_NAME} directly? Just reply to this email.\n\n"
        f"(You received this because this address was entered on {SITE_URL.replace('https://', '')}.)"
    )
    text_lines = [intro, ""]
    rows = []
    for m in messages:
        who = "You" if m["role"] == "user" else "Assistant"
        text_lines.append(f"{who}: {m['content']}\n")
        bg = "#f3e8ff" if m["role"] == "user" else "#f5f5f5"
        rows.append(
            f'<div style="background:{bg};border-radius:8px;padding:10px 12px;margin:8px 0">'
            f'<div style="font-size:12px;color:#666">{who}</div>'
            f'<div style="white-space:pre-wrap">{html.escape(m["content"])}</div></div>'
        )
    text = "\n".join(text_lines + ["", footer])
    html_body = (
        '<div style="font-family:Arial,sans-serif;max-width:640px;color:#222">'
        f"<p>{html.escape(intro)}</p>" + "".join(rows) +
        f'<p>Want to reach {OWNER_FIRST_NAME} directly? Just reply to this email.</p>'
        f'<p style="font-size:12px;color:#888">You received this because this address was entered on '
        f'{html.escape(SITE_URL.replace("https://", ""))}.</p></div>'
    )
    return subject, text, html_body


def send_conversation_copy(session_id: str, email: str) -> None:
    supabase = get_supabase_client()
    email = email.strip().lower()
    already = (
        supabase.table("contact_messages").select("id")
        .eq("session_id", session_id).eq("source", "transcript_copy").limit(1).execute().data
    )
    if already:
        raise HTTPException(status_code=409, detail="A copy of this conversation was already sent.")
    since = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    recent = (
        supabase.table("contact_messages").select("id", count="exact")
        .eq("email", email).eq("source", "transcript_copy").gte("created_at", since).execute().count
    ) or 0
    if recent >= MAX_COPIES_PER_ADDRESS_PER_DAY:
        raise HTTPException(status_code=429, detail="Too many copies sent to this address today.")
    messages = _load_messages(session_id)
    if not messages:
        raise HTTPException(status_code=404, detail="There's no conversation to send yet.")
    send_email(email, *_build_visitor_copy(messages), reply_to=NOTIFY_EMAIL)
    record_contact("transcript_copy", email, session_id=session_id)


@router.post(
    "/api/conversations/send-copy",
    dependencies=[Depends(rate_limiter("conversation-copy", limit=3, window_seconds=3600))],
)
def conversation_copy(req: ConversationCopyRequest):
    session_id = parse_session_id(req.session_id)
    if not session_id:
        raise HTTPException(status_code=422, detail="Invalid conversation.")
    if not is_valid_email(req.email):
        raise HTTPException(status_code=422, detail="Please enter a valid email address.")
    try:
        send_conversation_copy(session_id, req.email)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Conversation copy error: {e!r}")
        raise HTTPException(status_code=500, detail="Couldn't send the copy right now. Please try again later.")
    return {"status": "sent"}
