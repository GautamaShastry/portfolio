"""Shared, lazily-initialized Supabase client (service-role key -> bypasses RLS, server-side only)."""
import os
from fastapi import HTTPException
from supabase import create_client, Client

_client: Client | None = None


def get_supabase_client() -> Client:
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not url or not key:
            print("WARNING: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set")
            raise HTTPException(status_code=500, detail="Supabase is not configured")
        _client = create_client(url, key)
    return _client
