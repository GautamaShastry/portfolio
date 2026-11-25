"""Summarize who a visitor was and what they want, from a finished chat / voice conversation,
for the top of the transcript email (and to know whom to send a confirmation to)."""
import json
import re

from bedrock_client import chat
from mailer import is_valid_email

VISITOR_TYPES = {"recruiter", "hiring_manager", "exploring", "unknown"}

EXTRACT_PROMPT = """You read a conversation between a visitor and the AI assistant on Satya Bulusu's portfolio site, and summarize it for Satya.

Return only a JSON object with these keys:
- "visitor_type": "recruiter", "hiring_manager", "exploring", or "unknown"
- "name": the visitor's name, or null
- "company": the visitor's company, or null
- "role": the job or role they're hiring for, or null
- "email": the visitor's own email address, exactly as they wrote it, or null
- "summary": one or two sentences on what the visitor wanted
- "next_step": one short suggestion for how Satya should follow up, or null

Use only what the visitor themselves said; don't guess. The assistant's own messages may mention Satya's email: that is never the visitor's email."""


def _visitor_text(messages: list[dict]) -> str:
    return "\n".join(m["content"] for m in messages if m["role"] == "user")


def extract_lead(messages: list[dict]) -> dict | None:
    transcript = "\n\n".join(
        f"{'Visitor' if m['role'] == 'user' else 'Assistant'}: {m['content']}" for m in messages
    )
    try:
        raw = chat(EXTRACT_PROMPT, [{"role": "user", "content": f"<conversation>\n{transcript[:20000]}\n</conversation>"}], max_tokens=600)
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        lead = json.loads(match.group(0)) if match else None
    except Exception as e:
        print(f"Lead extraction failed: {e!r}")
        return None
    if not isinstance(lead, dict):
        return None

    lead = {k: lead.get(k) for k in ("visitor_type", "name", "company", "role", "email", "summary", "next_step")}
    if lead["visitor_type"] not in VISITOR_TYPES:
        lead["visitor_type"] = "unknown"
    # Trust an email only if the visitor actually typed it.
    email = (lead.get("email") or "").strip()
    if not (is_valid_email(email) and email.lower() in _visitor_text(messages).lower()):
        lead["email"] = None
    for key in ("name", "company", "role", "summary", "next_step"):
        if lead.get(key) is not None:
            lead[key] = str(lead[key])[:300]
    return lead


VISITOR_LABELS = {
    "recruiter": "Recruiter",
    "hiring_manager": "Hiring manager",
    "exploring": "Just exploring",
    "unknown": "Visitor",
}


def lead_headline(lead: dict | None) -> str | None:
    """e.g. 'Recruiter: Jane Doe (Acme) - Senior Backend Engineer'"""
    if not lead or lead["visitor_type"] in ("unknown", "exploring") and not lead.get("name"):
        return None
    who = lead.get("name") or "unnamed"
    if lead.get("company"):
        who += f" ({lead['company']})"
    headline = f"{VISITOR_LABELS[lead['visitor_type']]}: {who}"
    if lead.get("role"):
        headline += f" - {lead['role']}"
    return headline
