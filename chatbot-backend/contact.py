"""Contact form: saves the message, emails it to Satya (Reply-To: the sender, so he can just
hit reply), and sends the sender a fixed confirmation from notifications@ (see mailer.py)."""
import html

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from mailer import NOTIFY_EMAIL, is_valid_email, record_contact, send_acknowledgment, send_email
from rate_limit import rate_limiter

router = APIRouter()


class ContactRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: str = Field(min_length=3, max_length=254)
    message: str = Field(min_length=1, max_length=5000)
    # Honeypot: hidden in the form, so only bots fill it in.
    website: str = ""


def _notify_satya(req: ContactRequest) -> None:
    subject = f"Portfolio contact form: {req.name[:80]}"
    text = f"New message from your portfolio contact form.\n\nName: {req.name}\nEmail: {req.email}\n\n{req.message}\n\n(Reply to this email to answer them directly.)"
    html_body = (
        '<div style="font-family:Arial,sans-serif;max-width:640px">'
        "<h2>New contact form message</h2>"
        f"<p><b>Name:</b> {html.escape(req.name)}<br><b>Email:</b> {html.escape(req.email)}</p>"
        f'<div style="white-space:pre-wrap;background:#f5f5f5;border-radius:8px;padding:12px">{html.escape(req.message)}</div>'
        '<p style="color:#666;font-size:13px">Reply to this email to answer them directly.</p></div>'
    )
    send_email(NOTIFY_EMAIL, subject, text, html_body, reply_to=req.email.strip())


@router.post(
    "/api/contact",
    dependencies=[Depends(rate_limiter("contact", limit=3, window_seconds=600))],
)
def submit_contact(req: ContactRequest):
    if req.website:
        return {"status": "sent"}  # bot: pretend success, do nothing
    if not is_valid_email(req.email):
        raise HTTPException(status_code=422, detail="Please enter a valid email address.")
    if not NOTIFY_EMAIL:
        raise HTTPException(status_code=500, detail="The contact form isn't configured yet. Please email Satya directly.")
    try:
        contact_id = record_contact("form", req.email, req.name, req.message)
        _notify_satya(req)
    except Exception as e:
        print(f"Contact form error: {e!r}")
        raise HTTPException(status_code=500, detail="Couldn't send your message. Please try again or email Satya directly.")
    acknowledged = send_acknowledgment(contact_id, req.email, req.name, "form")
    return {"status": "sent", "acknowledged": acknowledged}
