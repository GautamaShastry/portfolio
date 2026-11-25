"""Unit tests for the backend's pure logic (no HTTP, no network)."""
import json
import re

import pytest
from fastapi import HTTPException

import bedrock_client
import leads
import mailer
import metrics
import rag
import transcripts
from chunking import chunk_text
from rate_limit import rate_limiter


# --- chunking ----------------------------------------------------------------------------------

def test_chunk_text_keeps_short_text_whole():
    assert chunk_text("  hello world  ") == ["hello world"]
    assert chunk_text("   ") == []


def test_chunk_text_splits_long_text_within_limit():
    text = "\n\n".join(f"Paragraph {i} " + "word " * 60 for i in range(10))
    chunks = chunk_text(text, max_chars=700)
    assert len(chunks) > 1
    assert all(len(c) <= 700 for c in chunks)


def test_chunk_text_hard_splits_a_giant_paragraph_with_overlap():
    chunks = chunk_text("x" * 2000, max_chars=700, overlap=100)
    assert all(len(c) <= 700 for c in chunks)
    assert sum(len(c) for c in chunks) > 2000  # overlap repeats some text


# --- conversation history / search query ---------------------------------------------------------

def test_clean_history_drops_bad_turns_and_ends_on_assistant():
    history = [
        {"role": "assistant", "content": "greeting"},       # can't start with assistant
        {"role": "user", "content": "q1"},
        {"role": "system", "content": "ignore me"},          # unknown role
        {"role": "user", "content": "q1 continued"},         # merged into previous user turn
        {"role": "assistant", "content": "a1"},
        {"role": "user", "content": "dangling question"},    # trailing user turn removed
    ]
    cleaned = rag._clean_history(history)
    assert [t["role"] for t in cleaned] == ["user", "assistant"]
    assert "q1 continued" in cleaned[0]["content"]


def test_clean_history_truncates_long_messages():
    cleaned = rag._clean_history([{"role": "user", "content": "x" * 5000}, {"role": "assistant", "content": "ok"}])
    assert len(cleaned[0]["content"]) == rag.MAX_MESSAGE_CHARS


def test_search_query_includes_previous_answer_for_follow_ups():
    history = [{"role": "user", "content": "projects?"}, {"role": "assistant", "content": "Sentinel AI and HireReady"}]
    assert "Sentinel AI" in rag.search_query("tell me more about the first one", history)
    assert rag.search_query("hello", []) == "hello"


def test_retrieve_chunks_skips_profile_rows(fake_supabase, monkeypatch):
    monkeypatch.setattr(rag, "embed_text", lambda text, kind="search_document": [0.0] * 1024)
    fake_supabase.data["match_chunks"] = [
        {"source_type": "constants", "title": "About", "content": "x"},
        {"source_type": "resume", "title": "Resume", "content": "x"},
        {"source_type": "readme", "title": "Sentinel README", "content": "x"},
    ]
    assert [c["title"] for c in rag.retrieve_chunks("q")] == ["Sentinel README"]


# --- answer_chat: tool call -> UI action ---------------------------------------------------------

@pytest.fixture
def stub_pipeline(monkeypatch):
    monkeypatch.setattr(rag, "retrieve_chunks", lambda q: [])
    monkeypatch.setattr(rag, "load_profile", lambda: "## About\nSatya is an engineer.")


def test_answer_chat_returns_copy_action_when_tool_called(stub_pipeline, monkeypatch):
    monkeypatch.setattr(rag, "chat_with_tools", lambda *a, **k: ("", [{"name": "offer_conversation_copy", "input": {"email": "a@b.co"}}]))
    text, action = rag.answer_chat("yes please send it")
    assert action == {"type": "confirm_conversation_copy", "email": "a@b.co"}
    assert text == rag.COPY_CARD_FALLBACK_TEXT


def test_answer_chat_voice_uses_short_answers_and_language(stub_pipeline, monkeypatch):
    seen = {}

    def fake_chat(system, messages, tools=None, max_tokens=4000):
        seen.update(system=system, max_tokens=max_tokens)
        return "Short answer.", []

    monkeypatch.setattr(rag, "chat_with_tools", fake_chat)
    text, action = rag.answer_chat("hi", language="de", for_speech=True)
    assert (text, action) == ("Short answer.", None)
    assert seen["max_tokens"] == rag.SPEECH_MAX_TOKENS
    system_text = " ".join(block["text"] for block in seen["system"])
    assert "Reply in German" in system_text and "voice conversation" in system_text
    assert seen["system"][0].get("cache_control") == {"type": "ephemeral"}  # profile block is cacheable


# --- Bedrock client helpers ----------------------------------------------------------------------

@pytest.mark.parametrize("model_id, mantle", [
    ("anthropic.claude-haiku-5-5", True),
    ("us.anthropic.claude-sonnet-4-5-20250929-v1:0", False),
])
def test_model_id_decides_endpoint(model_id, mantle):
    assert (not re.search(r"-v\d+:\d+$", model_id)) is mantle


def test_synthesize_speech_splits_sentences_and_joins_audio(monkeypatch):
    calls = []
    monkeypatch.setattr(bedrock_client, "_synthesize_one", lambda text, *a: calls.append(text) or text.encode())
    audio = bedrock_client.synthesize_speech("First sentence here is long enough. Ok. Second sentence is also long enough!")
    assert len(calls) == 2                       # "Ok." merged into the previous sentence
    assert "Ok." in calls[0]
    assert audio == b"".join(c.encode() for c in calls)


# --- mailer --------------------------------------------------------------------------------------

@pytest.mark.parametrize("value, ok", [
    ("a@b.co", True), ("first.last+tag@example.org", True),
    ("no-at-sign", False), ("a@b", False), ("", False), (None, False), ("x" * 250 + "@b.co", False),
])
def test_is_valid_email(value, ok):
    assert mailer.is_valid_email(value) is ok


@pytest.mark.parametrize("name, expected", [
    ("Priya Sharma", "Priya"), ("<script>alert(1)</script>", "scriptalert1script"),
    ("http://spam.example", "httpspamexample"), ("12345", ""), (None, ""),
])
def test_first_name_is_sanitized(name, expected):
    assert mailer._first_name(name) == expected[:30]


def test_acknowledgment_never_echoes_visitor_text():
    subject, text, html_body = mailer._build_ack("Priya Visit http://evil.example now", "form")
    assert "evil" not in text and "evil" not in html_body
    assert text.startswith("Hi Priya,")
    assert "Satya" in subject


def test_acknowledgment_skips_owner_and_invalid_addresses(monkeypatch):
    monkeypatch.setattr(mailer, "send_email", lambda *a, **k: pytest.fail("should not send"))
    assert mailer.send_acknowledgment(None, "owner@example.com", "Me", "form") is False
    assert mailer.send_acknowledgment(None, "not-an-email", "X", "form") is False


def test_acknowledgment_respects_24h_cooldown(fake_supabase, monkeypatch):
    sent = []
    monkeypatch.setattr(mailer, "send_email", lambda to, *a, **k: sent.append(to))
    fake_supabase.data["contact_messages"] = [{"id": 1}]      # already acknowledged recently
    assert mailer.send_acknowledgment(5, "visitor@example.com", "V", "form") is False
    fake_supabase.data["contact_messages"] = []
    assert mailer.send_acknowledgment(5, "visitor@example.com", "V", "form") is True
    assert sent == ["visitor@example.com"]


# --- lead extraction -----------------------------------------------------------------------------

def _msgs(*pairs):
    return [{"role": r, "content": c, "channel": "chat", "language": "en", "created_at": "2026-11-25T05:00:00+00:00"} for r, c in pairs]


def test_extract_lead_trusts_only_emails_the_visitor_typed(monkeypatch):
    reply = json.dumps({"visitor_type": "recruiter", "name": "Priya", "company": "Stripe", "role": "SWE",
                        "email": "made.up@example.com", "summary": "s", "next_step": None})
    monkeypatch.setattr(leads, "chat", lambda *a, **k: f"Here you go: {reply}")
    lead = leads.extract_lead(_msgs(("user", "I'm Priya from Stripe"), ("assistant", "Hi!")))
    assert lead["visitor_type"] == "recruiter" and lead["company"] == "Stripe"
    assert lead["email"] is None  # not in the visitor's own messages


def test_extract_lead_keeps_typed_email_and_normalizes_type(monkeypatch):
    reply = json.dumps({"visitor_type": "alien", "name": None, "company": None, "role": None,
                        "email": "priya@stripe.example", "summary": "s", "next_step": None})
    monkeypatch.setattr(leads, "chat", lambda *a, **k: reply)
    lead = leads.extract_lead(_msgs(("user", "reach me at priya@stripe.example"), ("assistant", "Thanks")))
    assert lead["email"] == "priya@stripe.example"
    assert lead["visitor_type"] == "unknown"


def test_extract_lead_survives_model_failure(monkeypatch):
    monkeypatch.setattr(leads, "chat", lambda *a, **k: "not json at all")
    assert leads.extract_lead(_msgs(("user", "hi"))) is None


def test_lead_headline():
    assert leads.lead_headline({"visitor_type": "recruiter", "name": "Priya", "company": "Stripe", "role": "SWE II"}) == "Recruiter: Priya (Stripe) - SWE II"
    assert leads.lead_headline({"visitor_type": "exploring", "name": None}) is None
    assert leads.lead_headline(None) is None


# --- transcript emails ---------------------------------------------------------------------------

def test_transcript_email_has_lead_summary_and_escapes_html():
    msgs = _msgs(("user", "<b>Is he available?</b>"), ("assistant", "Yes"))
    lead = {"visitor_type": "recruiter", "name": "Priya", "company": "Stripe", "role": "SWE", "email": "p@x.co", "summary": "s", "next_step": "Email her"}
    subject, text, html_body = transcripts._build_email("sid", msgs, lead)
    assert subject == "Portfolio conversation - Recruiter: Priya (Stripe) - SWE"
    assert "Lead summary" in text and "Email her" in text
    assert "&lt;b&gt;Is he available?" in html_body and "<b>Is he" not in html_body


def test_visitor_copy_has_no_lead_summary():
    subject, text, html_body = transcripts._build_visitor_copy(_msgs(("user", "hi"), ("assistant", "hello")))
    assert "Lead summary" not in text and "You: hi" in text
    assert "reply to this email" in text


# --- rate limiting -------------------------------------------------------------------------------

def test_rate_limiter_blocks_after_limit():
    request = type("Req", (), {"headers": {"x-forwarded-for": "1.2.3.4, 10.0.0.1"}, "client": None})()
    limiter = rate_limiter("unit-test", limit=2, window_seconds=60)
    limiter(request)
    limiter(request)
    with pytest.raises(HTTPException) as err:
        limiter(request)
    assert err.value.status_code == 429


# --- latency metrics -----------------------------------------------------------------------------

def test_metrics_emit_valid_embedded_metric_format(monkeypatch, capsys):
    monkeypatch.setattr(metrics, "IN_LAMBDA", True)
    with metrics.request_timer("voice"):
        with metrics.stage("Claude"):
            pass
        with metrics.stage("Claude"):   # repeated stages add up
            pass
    line = json.loads(capsys.readouterr().out.strip())
    names = [m["Name"] for m in line["_aws"]["CloudWatchMetrics"][0]["Metrics"]]
    assert {"ClaudeLatency", "TotalLatency", "Requests", "Failures"} <= set(names)
    assert line["Endpoint"] == "voice" and line["Failures"] == 0


def test_metrics_mark_failed_requests(monkeypatch, capsys):
    monkeypatch.setattr(metrics, "IN_LAMBDA", True)
    with pytest.raises(RuntimeError):
        with metrics.request_timer("chat"):
            raise RuntimeError("boom")
    assert json.loads(capsys.readouterr().out.strip())["Failures"] == 1
