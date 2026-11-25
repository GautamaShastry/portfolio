"""Password-gated admin API: login issues a short-lived JWT, and blog post writes go
through here (using the Supabase service-role key) so drafts stay private and every
published post gets embedded into content_chunks immediately, not just on next deploy."""
import os
import re
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from chunking import chunk_text
from bedrock_client import embed_text
from rate_limit import rate_limiter
from supabase_client import get_supabase_client

router = APIRouter()
bearer_scheme = HTTPBearer()

JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 12


class LoginRequest(BaseModel):
    password: str


class LoginResponse(BaseModel):
    token: str


class PostIn(BaseModel):
    title: str
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content_md: str
    tags: list[str] = []
    published: bool = False


class PostOut(PostIn):
    id: str
    slug: str
    published_at: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


def _jwt_secret() -> str:
    secret = os.getenv("ADMIN_JWT_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="Admin auth is not configured")
    return secret


def require_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> None:
    try:
        jwt.decode(credentials.credentials, _jwt_secret(), algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please log in again")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid session")


def slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug or uuid.uuid4().hex[:8]


def reembed_post(post_id: str, slug: str, title: str, content_md: str, published: bool) -> None:
    """Keep content_chunks in sync with a post's current state: drafts/deletes have no
    chunks, published posts get their chunks fully replaced."""
    supabase = get_supabase_client()
    supabase.table("content_chunks").delete().eq("source_type", "blog").eq("source_id", post_id).execute()

    if not published:
        return

    chunks = chunk_text(content_md)
    rows = [
        {
            "source_type": "blog",
            "source_id": post_id,
            "title": title,
            "content": chunk,
            "url": f"/blog/{slug}",
            "embedding": embed_text(chunk),
        }
        for chunk in chunks
    ]
    if rows:
        supabase.table("content_chunks").insert(rows).execute()


@router.post(
    "/api/admin/login",
    response_model=LoginResponse,
    dependencies=[Depends(rate_limiter("admin-login", limit=5, window_seconds=300))],
)
async def login(request: LoginRequest):
    password_hash = os.getenv("ADMIN_PASSWORD_HASH")
    if not password_hash:
        raise HTTPException(status_code=500, detail="Admin auth is not configured")
    if not bcrypt.checkpw(request.password.encode("utf-8"), password_hash.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Incorrect password")

    payload = {
        "sub": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
    }
    token = jwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)
    return LoginResponse(token=token)


@router.get("/api/admin/posts", dependencies=[Depends(require_admin)])
def list_all_posts():
    supabase = get_supabase_client()
    result = supabase.table("blog_posts").select("*").order("created_at", desc=True).execute()
    return result.data


@router.post("/api/admin/posts", dependencies=[Depends(require_admin)])
def create_post(post: PostIn):
    supabase = get_supabase_client()
    slug = post.slug.strip() if post.slug else slugify(post.title)
    now = datetime.now(timezone.utc).isoformat()
    row = {
        "slug": slug,
        "title": post.title,
        "excerpt": post.excerpt,
        "content_md": post.content_md,
        "tags": post.tags,
        "published": post.published,
        "published_at": now if post.published else None,
    }
    try:
        result = supabase.table("blog_posts").insert(row).execute()
    except Exception as e:
        print(f"Create post error: {e!r}")
        raise HTTPException(status_code=409, detail="Could not create post - is that slug already taken?")

    created = result.data[0]
    reembed_post(created["id"], created["slug"], created["title"], created["content_md"], created["published"])
    return created


@router.put("/api/admin/posts/{post_id}", dependencies=[Depends(require_admin)])
def update_post(post_id: str, post: PostIn):
    supabase = get_supabase_client()
    existing = supabase.table("blog_posts").select("*").eq("id", post_id).single().execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Post not found")

    was_published = existing.data["published"]
    now = datetime.now(timezone.utc).isoformat()
    updates = {
        "title": post.title,
        "slug": post.slug.strip() if post.slug else existing.data["slug"],
        "excerpt": post.excerpt,
        "content_md": post.content_md,
        "tags": post.tags,
        "published": post.published,
        "updated_at": now,
    }
    if post.published and not was_published:
        updates["published_at"] = now

    result = supabase.table("blog_posts").update(updates).eq("id", post_id).execute()
    updated = result.data[0]
    reembed_post(updated["id"], updated["slug"], updated["title"], updated["content_md"], updated["published"])
    return updated


@router.delete("/api/admin/posts/{post_id}", dependencies=[Depends(require_admin)])
def delete_post(post_id: str):
    supabase = get_supabase_client()
    supabase.table("content_chunks").delete().eq("source_type", "blog").eq("source_id", post_id).execute()
    supabase.table("blog_posts").delete().eq("id", post_id).execute()
    return {"status": "deleted"}
