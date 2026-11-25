"""Outbound email via Amazon SES: notifications to the site owner, and acknowledgments to people
who get in touch (contact form, or an email address left with the chat assistant).

Acknowledgments go to addresses typed by strangers, so they're built to be useless for abuse:
a fixed message that never echoes what the sender wrote, a sanitized first name only, and at
most one acknowledgment per address per 24 hours. Note: while the SES account is in sandbox
mode, SES only delivers to verified addresses, so acknowledgments to visitors need SES
production access."""
import html
import os
import re
from datetime import datetime, timedelta, timezone
from functools import lru_cache

import boto3

from bedrock_client import AWS_REGION
from owner import OWNER_FIRST_NAME, OWNER_NAME, SITE_HOST, SITE_URL
from supabase_client import get_supabase_client

NOTIFY_EMAIL = os.getenv("TRANSCRIPT_NOTIFY_EMAIL")                  # the owner's inbox
SENDER_EMAIL = os.getenv("TRANSCRIPT_SENDER_EMAIL") or NOTIFY_EMAIL   # SES-verified sender
SES_REGION = os.getenv("SES_REGION") or AWS_REGION
ACK_COOLDOWN = timedelta(hours=24)

EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")


@lru_cache(maxsize=1)
def _ses():
    return boto3.client("sesv2", region_name=SES_REGION)


def is_valid_email(value: str | None) -> bool:
    return bool(value) and len(value) <= 254 and bool(EMAIL_RE.match(value.strip()))


def send_email(to: str, subject: str, text_body: str, html_body: str, reply_to: str | None = None) -> None:
    request = {
        "FromEmailAddress": f"{OWNER_NAME} <{SENDER_EMAIL}>",
        "Destination": {"ToAddresses": [to]},
        "Content": {"Simple": {
            "Subject": {"Data": subject, "Charset": "UTF-8"},
            "Body": {
                "Text": {"Data": text_body, "Charset": "UTF-8"},
                "Html": {"Data": html_body, "Charset": "UTF-8"},
            },
        }},
    }
    if reply_to:
        request["ReplyToAddresses"] = [reply_to]
    _ses().send_email(**request)


def _first_name(name: str | None) -> str:
    """Only letters from the first word, so a 'name' can't carry links or spam text."""
    first = (name or "").strip().split(" ")[0]
    first = re.sub(r"[^\w'-]", "", first, flags=re.UNICODE)[:30]
    return first if first and not first.isdigit() else ""


ACK_BODIES = {
    "form": f"thanks for getting in touch. {OWNER_FIRST_NAME} has received your message and will get back to you soon.",
    "chat": f"thanks for chatting with {OWNER_FIRST_NAME}'s AI assistant. {OWNER_FIRST_NAME} has received your conversation and will follow up with you soon.",
}


def _build_ack(name: str | None, source: str) -> tuple[str, str, str]:
    first = _first_name(name)
    greeting = f"Hi {first}," if first else "Hi,"
    body = ACK_BODIES.get(source, ACK_BODIES["form"])
    subject = f"Thanks for reaching out to {OWNER_NAME}"
    text = (
        f"{greeting}\n\n{body[0].upper() + body[1:]}\n\n"
        "If you need to add anything, just reply to this email.\n\n"
        f"{OWNER_NAME}\n{SITE_URL}\n\n"
        "(This is an automatic confirmation. You received it because this address was "
        f"entered on {SITE_HOST}.)"
    )
    html_body = (
        '<div style="font-family:Arial,sans-serif;max-width:560px;color:#222;line-height:1.5">'
        f"<p>{html.escape(greeting)}</p>"
        f"<p>{html.escape(body[0].upper() + body[1:])}</p>"
        "<p>If you need to add anything, just reply to this email.</p>"
        f'<p>{html.escape(OWNER_NAME)}<br><a href="{SITE_URL}">{html.escape(SITE_HOST)}</a></p>'
        '<p style="font-size:12px;color:#888">This is an automatic confirmation. You received it because '
        f"this address was entered on {html.escape(SITE_HOST)}.</p>"
        "</div>"
    )
    return subject, text, html_body


def _recently_acknowledged(email: str) -> bool:
    since = (datetime.now(timezone.utc) - ACK_COOLDOWN).isoformat()
    rows = (
        get_supabase_client().table("contact_messages")
        .select("id")
        .eq("email", email.strip().lower())
        .gte("ack_sent_at", since)
        .limit(1)
        .execute()
        .data
    )
    return bool(rows)


def record_contact(source: str, email: str, name: str | None = None, message: str | None = None,
                   session_id: str | None = None) -> int | None:
    row = {"source": source, "email": email.strip().lower(), "name": (name or "")[:200] or None,
           "message": (message or "")[:5000] or None, "session_id": session_id}
    result = get_supabase_client().table("contact_messages").insert(row).execute()
    return result.data[0]["id"] if result.data else None


def send_acknowledgment(contact_id: int | None, email: str, name: str | None, source: str) -> bool:
    """Send the fixed confirmation email, at most once per address per 24h. Returns True if sent."""
    email = email.strip()
    if not SENDER_EMAIL or not is_valid_email(email):
        return False
    if NOTIFY_EMAIL and email.lower() == NOTIFY_EMAIL.lower():
        return False
    try:
        if _recently_acknowledged(email):
            return False
        send_email(email, *_build_ack(name, source), reply_to=NOTIFY_EMAIL)
    except Exception as e:
        # In SES sandbox mode this fails for unverified recipients: needs SES production access.
        print(f"Acknowledgment email to visitor failed: {e!r}")
        return False
    if contact_id is not None:
        get_supabase_client().table("contact_messages").update(
            {"ack_sent_at": datetime.now(timezone.utc).isoformat()}
        ).eq("id", contact_id).execute()
    return True
