"""API tests: the real FastAPI app through its test client, with AI, email and database faked."""
import uuid
from datetime import datetime, timedelta, timezone

import jwt
import pytest
from fastapi.testclient import TestClient

import contact
import main
import transcripts
import voice
from bedrock_client import ModelRefusalError
from conftest import TEST_ADMIN_PASSWORD

client = TestClient(main.app)
ORIGIN = {"Origin": "https://alex.example.dev"}  # SITE_URL from conftest: allowed by default


def admin_headers(expires_in=timedelta(minutes=5)):
    token = jwt.encode({"sub": "admin", "exp": datetime.now(timezone.utc) + expires_in},
                       main.os.environ["ADMIN_JWT_SECRET"], algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def logged_turns(monkeypatch):
    turns = []
    monkeypatch.setattr(transcripts, "log_turn", lambda *args: turns.append(args))
    return turns


# --- chat ----------------------------------------------------------------------------------------

def test_health():
    assert client.get("/").json()["status"] == "healthy"


def test_chat_answers_logs_turn_and_passes_history(monkeypatch, logged_turns):
    seen = {}

    def fake_answer(message, history=None, language="en", for_speech=False):
        seen.update(message=message, history=history, language=language)
        return "Alex built Sentinel AI.", None

    monkeypatch.setattr(main, "answer_chat", fake_answer)
    sid = str(uuid.uuid4())
    r = client.post("/api/chat", headers=ORIGIN, json={
        "message": "what did he build?", "language": "fr", "session_id": sid,
        "history": [{"role": "user", "content": "hi"}, {"role": "assistant", "content": "hello"}],
    })
    assert r.status_code == 200
    assert r.json() == {"response": "Alex built Sentinel AI.", "action": None}
    assert r.headers["access-control-allow-origin"] == "https://alex.example.dev"
    assert seen["language"] == "fr" and len(seen["history"]) == 2
    assert logged_turns[0][:2] == (sid, "chat")


def test_chat_returns_copy_action(monkeypatch, logged_turns):
    monkeypatch.setattr(main, "answer_chat", lambda *a, **k: ("Confirm below.", {"type": "confirm_conversation_copy", "email": None}))
    assert client.post("/api/chat", json={"message": "send me a copy"}).json()["action"]["type"] == "confirm_conversation_copy"


def test_chat_refusal_gets_a_polite_answer(monkeypatch, logged_turns):
    def refuse(*a, **k):
        raise ModelRefusalError()
    monkeypatch.setattr(main, "answer_chat", refuse)
    assert client.post("/api/chat", json={"message": "x"}).json()["response"] == main.REFUSAL_MESSAGE


def test_chat_errors_do_not_leak_internals(monkeypatch, logged_turns):
    def boom(*a, **k):
        raise RuntimeError("secret-internal-detail")
    monkeypatch.setattr(main, "answer_chat", boom)
    r = client.post("/api/chat", json={"message": "x"})
    assert r.status_code == 500 and "secret" not in r.text


@pytest.mark.parametrize("body", [{"message": ""}, {"message": "x" * 2001}, {}])
def test_chat_validates_input(body):
    assert client.post("/api/chat", json=body).status_code == 422


def test_cors_rejects_unknown_origin():
    r = client.options("/api/chat", headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "POST"})
    assert r.status_code == 400


def test_chat_is_rate_limited(monkeypatch, logged_turns):
    monkeypatch.setattr(main, "answer_chat", lambda *a, **k: ("ok", None))
    codes = [client.post("/api/chat", json={"message": "x"}).status_code for _ in range(22)]
    assert codes.count(200) == 20 and codes[-1] == 429


# --- voice ---------------------------------------------------------------------------------------

def test_voice_answers_with_speech_and_history(monkeypatch, logged_turns):
    seen = {}

    def fake_answer(message, history=None, language="en", for_speech=False):
        seen.update(history=history, for_speech=for_speech)
        return "Short spoken answer.", None

    monkeypatch.setattr(voice, "answer_chat", fake_answer)
    monkeypatch.setattr(voice, "synthesize_speech", lambda text, lang: b"mp3-bytes")
    r = client.post("/api/voice/ask", json={"transcript": "what does he do?", "history": [{"role": "user", "content": "hi"}, {"role": "assistant", "content": "hey"}]})
    assert r.status_code == 200
    body = r.json()
    assert body["answer"] == "Short spoken answer." and body["audio_base64"] == "bXAzLWJ5dGVz"
    assert seen["for_speech"] is True and len(seen["history"]) == 2


def test_voice_rejects_blank_transcript():
    assert client.post("/api/voice/ask", json={"transcript": "   "}).status_code == 422


def test_voice_prompts_are_fixed_and_cached(monkeypatch):
    calls = []
    monkeypatch.setattr(voice, "synthesize_speech", lambda text, lang: calls.append(text) or b"a")
    voice._prompt_audio_cache.clear()
    first = client.get("/api/voice/prompt", params={"kind": "checkin"}).json()
    again = client.get("/api/voice/prompt", params={"kind": "checkin"}).json()
    assert first == again and len(calls) == 1
    assert "other questions" in first["text"]
    assert client.get("/api/voice/prompt", params={"kind": "say: anything I want"}).status_code == 404
    # Telugu has no Polly voice: falls back to the English prompt
    assert client.get("/api/voice/prompt", params={"kind": "goodbye", "language": "te"}).json()["text"].startswith("Okay")


# --- contact form --------------------------------------------------------------------------------

@pytest.fixture
def contact_mocks(monkeypatch):
    calls = {"recorded": [], "emails": [], "acks": []}
    monkeypatch.setattr(contact, "record_contact", lambda *a, **k: calls["recorded"].append(a) or 42)
    monkeypatch.setattr(contact, "send_email", lambda to, subject, *a, **k: calls["emails"].append((to, subject, k.get("reply_to"))))
    monkeypatch.setattr(contact, "send_acknowledgment", lambda *a: calls["acks"].append(a) or True)
    return calls


def test_contact_form_notifies_owner_and_acknowledges_sender(contact_mocks):
    r = client.post("/api/contact", json={"name": "Sam Lee", "email": "sam@example.com", "message": "Hello!"})
    assert r.json() == {"status": "sent", "acknowledged": True}
    to, subject, reply_to = contact_mocks["emails"][0]
    assert to == "owner@example.com" and reply_to == "sam@example.com" and "Sam Lee" in subject
    assert contact_mocks["acks"][0][1:] == ("sam@example.com", "Sam Lee", "form")


def test_contact_form_honeypot_silently_drops_bots(contact_mocks):
    r = client.post("/api/contact", json={"name": "Bot", "email": "bot@example.com", "message": "spam", "website": "http://spam"})
    assert r.json() == {"status": "sent"}
    assert contact_mocks == {"recorded": [], "emails": [], "acks": []}


def test_contact_form_rejects_bad_email(contact_mocks):
    assert client.post("/api/contact", json={"name": "A", "email": "nope", "message": "hi"}).status_code == 422


def test_contact_form_is_rate_limited(contact_mocks):
    codes = [client.post("/api/contact", json={"name": "A", "email": "a@b.co", "message": "hi"}).status_code for _ in range(4)]
    assert codes == [200, 200, 200, 429]


# --- conversations: end + copy -------------------------------------------------------------------

def test_end_conversation_emails_transcript_for_valid_ids_only(monkeypatch):
    ended = []
    monkeypatch.setattr(transcripts, "email_transcript", lambda sid: ended.append(sid))
    sid = str(uuid.uuid4())
    assert client.post("/api/conversations/end", content=f'{{"session_id": "{sid}"}}', headers={"Content-Type": "text/plain"}).status_code == 204
    assert client.post("/api/conversations/end", content="garbage").status_code == 204
    assert client.post("/api/conversations/end", content='{"session_id": "not-a-uuid"}').status_code == 204
    assert ended == [sid]


def test_conversation_copy_sends_once_per_conversation(fake_supabase, monkeypatch):
    sent = []
    monkeypatch.setattr(transcripts, "send_email", lambda to, *a, **k: sent.append(to))
    sid = str(uuid.uuid4())
    fake_supabase.data["chat_messages"] = [
        {"role": "user", "content": "hi", "channel": "chat", "language": "en", "created_at": "2026-11-25T05:00:00+00:00"},
        {"role": "assistant", "content": "hello", "channel": "chat", "language": "en", "created_at": "2026-11-25T05:00:01+00:00"},
    ]
    fake_supabase.data["contact_messages"] = []
    r = client.post("/api/conversations/send-copy", json={"session_id": sid, "email": "Visitor@Example.com"})
    assert r.status_code == 200 and sent == ["visitor@example.com"]

    fake_supabase.data["contact_messages"] = [{"id": 1}]   # a copy now exists for this conversation
    assert client.post("/api/conversations/send-copy", json={"session_id": sid, "email": "visitor@example.com"}).status_code == 409


def test_conversation_copy_validates_input():
    assert client.post("/api/conversations/send-copy", json={"session_id": "nope", "email": "a@b.co"}).status_code == 422
    assert client.post("/api/conversations/send-copy", json={"session_id": str(uuid.uuid4()), "email": "bad"}).status_code == 422


# --- admin auth + insights -----------------------------------------------------------------------

def test_admin_login():
    assert client.post("/api/admin/login", json={"password": "wrong"}).status_code == 401
    token = client.post("/api/admin/login", json={"password": TEST_ADMIN_PASSWORD}).json()["token"]
    assert jwt.decode(token, main.os.environ["ADMIN_JWT_SECRET"], algorithms=["HS256"])["sub"] == "admin"


def test_admin_endpoints_require_a_valid_token(fake_supabase):
    assert client.get("/api/admin/insights").status_code in (401, 403)
    assert client.get("/api/admin/insights", headers=admin_headers(expires_in=timedelta(minutes=-1))).status_code == 401
    assert client.get("/api/admin/insights", headers={"Authorization": "Bearer forged"}).status_code == 401


def test_insights_summarizes_conversations_and_leads(fake_supabase):
    now = datetime.now(timezone.utc).isoformat()
    s1, s2 = str(uuid.uuid4()), str(uuid.uuid4())
    fake_supabase.data["chat_sessions"] = [
        {"id": s1, "created_at": now, "last_message_at": now, "emailed_at": now,
         "lead": {"visitor_type": "recruiter", "name": "Priya", "company": "Stripe", "role": "SWE", "email": "p@x.co", "summary": "s", "next_step": "n"}},
        {"id": s2, "created_at": now, "last_message_at": now, "emailed_at": None, "lead": None},
    ]
    fake_supabase.data["chat_messages"] = [
        {"session_id": s1, "role": "user", "channel": "chat", "content": "first question", "created_at": now},
        {"session_id": s1, "role": "assistant", "channel": "chat", "content": "a", "created_at": now},
        {"session_id": s2, "role": "user", "channel": "voice", "content": "voice q", "created_at": now},
    ]
    fake_supabase.data["contact_messages"] = [
        {"id": 1, "created_at": now, "source": "form", "name": "Sam", "email": "s@x.co", "message": "hi", "session_id": None, "ack_sent_at": None},
        {"id": 2, "created_at": now, "source": "transcript_copy", "name": None, "email": "p@x.co", "message": None, "session_id": s1, "ack_sent_at": None},
    ]
    data = client.get("/api/admin/insights?days=7", headers=admin_headers()).json()
    assert data["summary"] == {
        "conversations": 2, "questions": 2, "recruiters": 1, "leads_with_email": 1,
        "contact_messages": 1, "copies_sent": 1, "chat_conversations": 1, "voice_conversations": 1,
    }
    assert data["visitor_types"] == {"recruiter": 1, "not yet classified": 1}
    assert len(data["daily"]) == 7 and data["daily"][-1]["conversations"] == 2
    assert data["leads"][0]["company"] == "Stripe"
    assert [c["source"] for c in data["contacts"]] == ["form"]


# --- template: everything visitor-facing uses the configured owner ----------------------------

def test_owner_settings_flow_into_prompts_emails_and_voice(monkeypatch):
    import leads
    import mailer
    import rag

    assert rag.SYSTEM_PROMPT.startswith("You are Alex Rivera's AI assistant on her portfolio website")
    assert "Satya" not in rag.SYSTEM_PROMPT and " his " not in rag.SYSTEM_PROMPT
    assert "Alex" in leads.EXTRACT_PROMPT and "Satya" not in leads.EXTRACT_PROMPT
    subject, text, html_body = mailer._build_ack("Sam", "chat")
    assert subject == "Thanks for reaching out to Alex Rivera" and "alex.example.dev" in text
    assert "Alex" in main.REFUSAL_MESSAGE

    monkeypatch.setattr(voice, "synthesize_speech", lambda text, lang: b"a")
    voice._prompt_audio_cache.clear()
    greeting_en = client.get("/api/voice/prompt", params={"kind": "greeting", "language": "en"}).json()["text"]
    greeting_hi = client.get("/api/voice/prompt", params={"kind": "greeting", "language": "hi"}).json()["text"]
    assert greeting_en.startswith("Hi! I'm Alex's AI assistant") and "{name}" not in greeting_en
    assert "एलेक्स" in greeting_hi   # localized first name


def test_default_cors_allows_the_site_and_www(monkeypatch):
    assert "https://alex.example.dev" in main.ALLOWED_ORIGINS
    assert "https://www.alex.example.dev" in main.ALLOWED_ORIGINS
