"""Voice Q&A: the browser transcribes the spoken question (Web Speech API), the same RAG
path from rag.py answers it with Claude on Bedrock, and Amazon Polly speaks the answer."""
import base64

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from bedrock_client import ModelRefusalError, synthesize_speech
from rag import answer_chat
from owner import OWNER_FIRST_NAME, first_name
from rate_limit import rate_limiter
from metrics import request_timer, stage
import transcripts

router = APIRouter()

REFUSAL_MESSAGE = f"Sorry, I can't help with that. Ask me about {OWNER_FIRST_NAME}'s background, skills, or projects."


class HistoryMessage(BaseModel):
    role: str
    content: str


class VoiceAskRequest(BaseModel):
    transcript: str = Field(min_length=1, max_length=2000)
    # Earlier turns of this voice conversation, so follow-ups ("and which company was that?") work
    history: list[HistoryMessage] = Field(default_factory=list, max_length=20)
    language: str = "en"
    session_id: str | None = None


class VoiceAskResponse(BaseModel):
    transcript: str
    answer: str
    audio_base64: str
    action: dict | None = None


@router.post(
    "/api/voice/ask",
    response_model=VoiceAskResponse,
    dependencies=[Depends(rate_limiter("voice", limit=10, window_seconds=60))],
)
def voice_ask(request: VoiceAskRequest):
    with request_timer("voice"):
        return _voice_ask(request)


def _voice_ask(request: VoiceAskRequest):
    transcript = request.transcript.strip()
    if not transcript:
        raise HTTPException(status_code=422, detail="Couldn't hear a question in that recording")
    action = None
    try:
        try:
            answer, action = answer_chat(
                transcript,
                history=[m.model_dump() for m in request.history],
                language=request.language,
                for_speech=True,
            )
        except ModelRefusalError:
            answer = REFUSAL_MESSAGE
        transcripts.log_turn(request.session_id, "voice", request.language, transcript, answer)
        with stage("Speech"):
            speech_bytes = synthesize_speech(answer, request.language)
        return VoiceAskResponse(
            transcript=transcript,
            answer=answer,
            audio_base64=base64.b64encode(speech_bytes).decode("utf-8"),
            action=action,
        )
    except Exception as e:
        print(f"Voice error: {e!r}")
        raise HTTPException(status_code=500, detail="The voice agent is unavailable right now. Please try again later.")


# --- Spoken prompts: greeting, "any other questions?" check-in, goodbye ----------------------
# Fixed texts only (never caller-supplied), synthesized once per language and cached, so this
# can't be used as a free text-to-speech service. Telugu has no Polly voice, so it uses English.
VOICE_PROMPTS = {
    # {name} = the owner's first name (per language, see owner.py); pronoun-free on purpose
    "greeting": {
        "en": "Hi! I'm {name}'s AI assistant. Are you a recruiter, a hiring manager, or just exploring? Ask me anything about {name}'s experience.",
        "de": "Hallo! Ich bin {name}s KI-Assistent. Sind Sie Recruiter, Hiring Manager oder schauen Sie sich nur um? Fragen Sie mich alles über {name}s Erfahrung.",
        "fr": "Bonjour ! Je suis l'assistant IA de {name}. Êtes-vous recruteur, responsable du recrutement, ou simplement curieux ? Posez-moi vos questions sur l'expérience de {name}.",
        "hi": "नमस्ते! मैं {name} का AI सहायक हूँ। क्या आप रिक्रूटर हैं, हायरिंग मैनेजर हैं, या बस देख रहे हैं? {name} के अनुभव के बारे में कुछ भी पूछिए।",
        "ja": "こんにちは！{name} の AI アシスタントです。採用担当者の方ですか？採用マネージャーの方ですか？それとも見学中ですか？{name} の経験について何でも聞いてください。",
        "zh": "你好！我是 {name} 的 AI 助手。请问您是招聘人员、招聘经理，还是随便看看？欢迎问我关于 {name} 经历的任何问题。",
    },
    "checkin": {
        "en": "Are there any other questions? I'm still listening.",
        "de": "Haben Sie noch weitere Fragen? Ich höre zu.",
        "fr": "Avez-vous d'autres questions ? Je vous écoute.",
        "hi": "क्या आपके कोई और सवाल हैं? मैं सुन रहा हूँ।",
        "ja": "ほかにご質問はありますか？お聞きしています。",
        "zh": "您还有其他问题吗？我在听。",
    },
    "goodbye": {
        "en": "Okay, I'll end our conversation here. Thanks for stopping by, and feel free to come back anytime!",
        "de": "Gut, dann beende ich unser Gespräch hier. Danke für Ihren Besuch, kommen Sie gern jederzeit wieder!",
        "fr": "D'accord, je termine notre conversation ici. Merci de votre visite, revenez quand vous voulez !",
        "hi": "ठीक है, मैं यहीं बातचीत खत्म करता हूँ। आने के लिए धन्यवाद, कभी भी फिर से आइए!",
        "ja": "それでは、ここで会話を終わりますね。ご来訪ありがとうございました。いつでもまたどうぞ！",
        "zh": "好的，我们的对话就到这里。感谢您的来访，欢迎随时再来！",
    },
}
_prompt_audio_cache: dict[tuple[str, str], dict] = {}


@router.get(
    "/api/voice/prompt",
    dependencies=[Depends(rate_limiter("voice-prompt", limit=30, window_seconds=60))],
)
def voice_prompt(kind: str, language: str = "en"):
    if kind not in VOICE_PROMPTS:
        raise HTTPException(status_code=404, detail="Unknown prompt")
    lang = language if language in VOICE_PROMPTS[kind] else "en"
    key = (kind, lang)
    if key not in _prompt_audio_cache:
        text = VOICE_PROMPTS[kind][lang].replace("{name}", first_name(lang))
        try:
            audio = synthesize_speech(text, lang)
        except Exception as e:
            print(f"Voice error: prompt {key}: {e!r}")
            raise HTTPException(status_code=500, detail="The voice agent is unavailable right now.")
        _prompt_audio_cache[key] = {"text": text, "audio_base64": base64.b64encode(audio).decode("utf-8")}
    return _prompt_audio_cache[key]
