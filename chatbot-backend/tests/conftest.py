"""Shared test setup. Tests run fully offline: Bedrock, Polly, SES and Supabase are replaced,
and any call that slips through to a real AWS client fails the test instead of costing money
or sending email."""
import os
import sys
from unittest.mock import MagicMock

import bcrypt
import pytest

# Test configuration, set before the app modules are imported (load_dotenv never overrides
# variables that are already set, so a developer's real .env can't leak in).
TEST_ADMIN_PASSWORD = "correct-horse-battery-staple"
os.environ.update({
    "ADMIN_JWT_SECRET": "test-secret-" + "x" * 32,
    "ADMIN_PASSWORD_HASH": bcrypt.hashpw(TEST_ADMIN_PASSWORD.encode(), bcrypt.gensalt(4)).decode(),
    "SUPABASE_URL": "https://example.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "test-service-role-key",
    "TRANSCRIPT_NOTIFY_EMAIL": "owner@example.com",
    "TRANSCRIPT_SENDER_EMAIL": "notifications@example.com",
    "ALLOWED_ORIGINS": "https://gautamportfolio.com,http://localhost:3001",
    "BEDROCK_REGION": "us-east-1",
})
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import bedrock_client  # noqa: E402
import mailer  # noqa: E402
import rate_limit  # noqa: E402


def _no_network(*_args, **_kwargs):
    raise AssertionError("A test tried to call a real AWS service; mock it instead.")


@pytest.fixture(autouse=True)
def offline(monkeypatch):
    """Every test: real AWS clients blocked, rate-limit counters reset."""
    monkeypatch.setattr(bedrock_client, "get_claude_client", _no_network)
    monkeypatch.setattr(bedrock_client, "_bedrock_runtime", _no_network)
    monkeypatch.setattr(bedrock_client, "_polly", _no_network)
    monkeypatch.setattr(mailer, "_ses", _no_network)
    rate_limit._hits.clear()
    yield
    rate_limit._hits.clear()


class FakeQuery:
    """Stands in for a Supabase query builder: every builder method returns itself, and
    execute() returns the rows configured for that table (or RPC function)."""

    def __init__(self, store, name):
        self.store, self.name = store, name
        self.calls = []

    def __getattr__(self, method):
        def builder(*args, **kwargs):
            self.calls.append((method, args, kwargs))
            self.store.log.append((self.name, method, args))
            return self
        return builder

    def execute(self):
        value = self.store.data.get(self.name, [])
        result = MagicMock()
        result.data = value(self) if callable(value) else value
        result.count = len(result.data) if isinstance(result.data, list) else 0
        return result


class FakeSupabase:
    def __init__(self, data=None):
        self.data = data or {}
        self.log = []

    def table(self, name):
        return FakeQuery(self, name)

    def rpc(self, name, params=None):
        self.log.append((name, "rpc", (params,)))
        return FakeQuery(self, name)


@pytest.fixture
def fake_supabase(monkeypatch):
    """A FakeSupabase patched into every module that talks to the database."""
    import admin, contact, insights, rag, transcripts  # noqa: E401
    fake = FakeSupabase()
    for module in (rag, mailer, transcripts, admin, insights, contact):
        if hasattr(module, "get_supabase_client"):
            monkeypatch.setattr(module, "get_supabase_client", lambda: fake)
    return fake
