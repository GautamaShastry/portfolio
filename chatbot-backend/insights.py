"""Admin insights: conversations with the chat / voice assistant, recruiter leads, contact-form
messages and conversation copies, read from Supabase. Admin-only (same JWT as the blog admin).

A conversation's lead details (visitor type, name, company, role, email) are filled in when its
transcript is emailed at the end of the conversation, so ongoing conversations show no lead yet."""
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query

from admin import require_admin
from supabase_client import get_supabase_client
from transcripts import parse_session_id

router = APIRouter(dependencies=[Depends(require_admin)])

MAX_ROWS = 5000


def _day(ts: str) -> str:
    return datetime.fromisoformat(ts).astimezone(timezone.utc).date().isoformat()


@router.get("/api/admin/insights")
def insights(days: int = Query(30, ge=1, le=365)):
    supabase = get_supabase_client()
    since = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    sessions = (
        supabase.table("chat_sessions").select("id,created_at,last_message_at,emailed_at,lead")
        .gte("created_at", since).order("created_at", desc=True).limit(MAX_ROWS).execute().data or []
    )
    messages = (
        supabase.table("chat_messages").select("session_id,role,channel,content,created_at")
        .gte("created_at", since).order("id").limit(MAX_ROWS * 10).execute().data or []
    )
    contacts = (
        supabase.table("contact_messages").select("id,created_at,source,name,email,message,session_id,ack_sent_at")
        .gte("created_at", since).order("created_at", desc=True).limit(MAX_ROWS).execute().data or []
    )

    # Per-conversation stats from its messages
    per_session: dict[str, dict] = defaultdict(lambda: {"questions": 0, "channels": set(), "first_question": None})
    for m in messages:
        s = per_session[m["session_id"]]
        s["channels"].add(m["channel"])
        if m["role"] == "user":
            s["questions"] += 1
            if s["first_question"] is None:
                s["first_question"] = m["content"][:200]

    visitor_types = Counter((s.get("lead") or {}).get("visitor_type") or "not yet classified" for s in sessions)
    leads = [
        {"session_id": s["id"], "created_at": s["created_at"], **s["lead"]}
        for s in sessions
        if s.get("lead") and s["lead"].get("visitor_type") in ("recruiter", "hiring_manager")
    ]

    # Conversations per day, every day in the window (zeros included)
    per_day = Counter(_day(s["created_at"]) for s in sessions)
    today = datetime.now(timezone.utc).date()
    daily = [
        {"date": (today - timedelta(days=i)).isoformat(), "conversations": per_day.get((today - timedelta(days=i)).isoformat(), 0)}
        for i in range(days - 1, -1, -1)
    ]

    conversations = []
    for s in sessions[:100]:
        stats = per_session.get(s["id"], {"questions": 0, "channels": set(), "first_question": None})
        lead = s.get("lead") or {}
        conversations.append({
            "id": s["id"],
            "started_at": s["created_at"],
            "last_message_at": s["last_message_at"],
            "questions": stats["questions"],
            "channels": sorted(stats["channels"]),
            "first_question": stats["first_question"],
            "visitor_type": lead.get("visitor_type"),
            "name": lead.get("name"),
            "company": lead.get("company"),
            "summary": lead.get("summary"),
            "emailed": bool(s.get("emailed_at")),
        })

    channel_counts = Counter()
    for stats in per_session.values():
        for ch in stats["channels"]:
            channel_counts[ch] += 1

    return {
        "days": days,
        "summary": {
            "conversations": len(sessions),
            "questions": sum(1 for m in messages if m["role"] == "user"),
            "recruiters": visitor_types.get("recruiter", 0) + visitor_types.get("hiring_manager", 0),
            "leads_with_email": sum(1 for lead in leads if lead.get("email")),
            "contact_messages": sum(1 for c in contacts if c["source"] == "form"),
            "copies_sent": sum(1 for c in contacts if c["source"] == "transcript_copy"),
            "chat_conversations": channel_counts.get("chat", 0),
            "voice_conversations": channel_counts.get("voice", 0),
        },
        "visitor_types": dict(visitor_types),
        "daily": daily,
        "leads": leads[:100],
        "conversations": conversations,
        "contacts": [c for c in contacts if c["source"] == "form"][:100],
        "truncated": len(sessions) >= MAX_ROWS,
    }


@router.get("/api/admin/insights/conversations/{session_id}")
def conversation_detail(session_id: str):
    sid = parse_session_id(session_id)
    if not sid:
        raise HTTPException(status_code=422, detail="Invalid conversation id")
    supabase = get_supabase_client()
    session = supabase.table("chat_sessions").select("id,created_at,lead").eq("id", sid).limit(1).execute().data
    if not session:
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = (
        supabase.table("chat_messages").select("role,channel,language,content,created_at")
        .eq("session_id", sid).order("id").execute().data or []
    )
    return {**session[0], "messages": messages}
