"""Per-IP sliding-window rate limiting for the public AI endpoints and the admin login.

The counters live in memory, so each warm Lambda container keeps its own: this stops
one visitor hammering the API, not a distributed attack. Pair it with reserved
concurrency on the Lambda function to put a hard ceiling on spend."""
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

_hits: dict[str, deque] = defaultdict(deque)


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limiter(name: str, limit: int, window_seconds: int):
    """Build a FastAPI dependency allowing `limit` requests per `window_seconds` per IP."""

    def dependency(request: Request) -> None:
        key = f"{name}:{client_ip(request)}"
        now = time.monotonic()
        hits = _hits[key]
        while hits and now - hits[0] > window_seconds:
            hits.popleft()
        if len(hits) >= limit:
            raise HTTPException(status_code=429, detail="Too many requests, please slow down and try again shortly.")
        hits.append(now)

    return dependency
