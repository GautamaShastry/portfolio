import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Only load dotenv for local development
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not needed in Lambda

from bedrock_client import ModelRefusalError
from rag import answer_chat
from rate_limit import rate_limiter
from metrics import request_timer
import voice
import admin
import transcripts
import contact
import insights

app = FastAPI(title="Portfolio Chatbot API")

# Comma-separated list, e.g. "https://gautamportfolio.com,http://localhost:3001"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "https://gautamportfolio.com,https://www.gautamportfolio.com,http://localhost:3001,http://localhost:5173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # auth uses a bearer header, not cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

REFUSAL_MESSAGE = "Sorry, I can't help with that. Ask me about Satya's background, skills, or projects."


class HistoryMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    history: list[HistoryMessage] = Field(default_factory=list, max_length=20)
    language: str = "en"
    session_id: str | None = None


class ChatResponse(BaseModel):
    response: str
    # UI action for the site, e.g. {"type": "confirm_conversation_copy", "email": "..."}
    action: dict | None = None


@app.get("/")
async def root():
    return {"status": "healthy", "message": "Portfolio Chatbot API"}


@app.post(
    "/api/chat",
    response_model=ChatResponse,
    dependencies=[Depends(rate_limiter("chat", limit=20, window_seconds=60))],
)
def chat(request: ChatRequest):
    with request_timer("chat"):
        return _chat(request)


def _chat(request: ChatRequest):
    action = None
    try:
        answer, action = answer_chat(
            request.message,
            history=[m.model_dump() for m in request.history],
            language=request.language,
        )
    except ModelRefusalError:
        answer = REFUSAL_MESSAGE
    except HTTPException:
        raise
    except Exception as e:
        print(f"Chat error: {e!r}")  # full detail goes to CloudWatch only
        raise HTTPException(status_code=500, detail="The assistant is unavailable right now. Please try again later.")

    transcripts.log_turn(request.session_id, "chat", request.language, request.message, answer)
    return ChatResponse(response=answer, action=action)


app.include_router(voice.router)
app.include_router(admin.router)
app.include_router(transcripts.router)
app.include_router(contact.router)
app.include_router(insights.router)

# AWS Lambda handler with Function URL support
from mangum import Mangum
_http_handler = Mangum(app, lifespan="off")


def handler(event, context):
    # The EventBridge schedule invokes the function with {"task": "send_pending_transcripts"}
    if isinstance(event, dict) and event.get("task") == "send_pending_transcripts":
        result = transcripts.send_pending_transcripts()
        print(f"Transcript sweep: {result}")
        return result
    return _http_handler(event, context)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
