"""Every AWS AI call goes through here: Claude on Bedrock for chat, Cohere for embeddings,
and Polly for speech. Auth comes from the Lambda execution role (or your local AWS
profile) - there are no API keys to manage."""
import json
import os
import re
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache

import boto3
from anthropic import AnthropicBedrock, AnthropicBedrockMantle

AWS_REGION = os.getenv("BEDROCK_REGION") or os.getenv("AWS_REGION") or "us-east-1"
# Two kinds of model ID, each served by a different Bedrock endpoint:
# - Claude 4.7 and newer, e.g. "anthropic.claude-haiku-5-5": the Messages-API endpoint
#   (bedrock-mantle), which supports the effort setting.
# - Older models are inference profiles with a version suffix, e.g.
#   "us.anthropic.claude-sonnet-4-5-20250929-v1:0": the classic bedrock-runtime endpoint.
#   These need anthropic<2.0 (see requirements.txt): 2.x sends an API version that
#   Bedrock only accepts for Claude 4.7+.
CHAT_MODEL = os.getenv("BEDROCK_CHAT_MODEL", "us.anthropic.claude-sonnet-4-5-20250929-v1:0")
USES_MANTLE = not re.search(r"-v\d+:\d+$", CHAT_MODEL)
# Cohere embeds questions and documents differently ("search_query" vs "search_document"),
# which matches a short question to the passage that answers it far better than Titan does.
# Multilingual, because the site has 7 languages.
EMBED_MODEL = os.getenv("BEDROCK_EMBED_MODEL", "cohere.embed-multilingual-v3")
# Must match the vector(...) size in supabase/schema.sql and scripts/reindex.mjs.
EMBED_DIMENSIONS = 1024


class ModelRefusalError(Exception):
    """Claude declined to answer (stop_reason == "refusal")."""


@lru_cache(maxsize=1)
def get_claude_client() -> AnthropicBedrock | AnthropicBedrockMantle:
    if USES_MANTLE:
        return AnthropicBedrockMantle(aws_region=AWS_REGION)
    return AnthropicBedrock(aws_region=AWS_REGION)


@lru_cache(maxsize=1)
def _bedrock_runtime():
    return boto3.client("bedrock-runtime", region_name=AWS_REGION)


@lru_cache(maxsize=1)
def _polly():
    return boto3.client("polly", region_name=AWS_REGION)


def chat_with_tools(
    system: str | list[dict], messages: list[dict], tools: list[dict] | None = None, max_tokens: int = 4000
) -> tuple[str, list[dict]]:
    """One Claude call. Returns (text, tool_calls), where tool_calls is a list of
    {"name": ..., "input": {...}}. Tools here are UI actions the site carries out (e.g. show a
    confirmation card), so there's no tool-result round trip."""
    extra = {}
    if USES_MANTLE:
        # Short factual Q&A over retrieved context: low effort keeps it fast and cheap.
        # (Older models such as Sonnet 4.5 reject the effort setting.)
        extra["output_config"] = {"effort": "low"}
    if tools:
        extra["tools"] = tools
    response = get_claude_client().messages.create(
        model=CHAT_MODEL,
        max_tokens=max_tokens,
        system=system,
        messages=messages,
        **extra,
    )
    if response.stop_reason == "refusal":
        raise ModelRefusalError()
    text = "".join(block.text for block in response.content if block.type == "text").strip()
    tool_calls = [{"name": b.name, "input": b.input or {}} for b in response.content if b.type == "tool_use"]
    return text, tool_calls


def chat(system: str | list[dict], messages: list[dict], max_tokens: int = 4000) -> str:
    return chat_with_tools(system, messages, max_tokens=max_tokens)[0]


def embed_text(text: str, kind: str = "search_document") -> list[float]:
    """kind: "search_document" for indexed content, "search_query" for a visitor's question."""
    response = _bedrock_runtime().invoke_model(
        modelId=EMBED_MODEL,
        contentType="application/json",
        accept="application/json",
        # Cohere rejects texts over 2048 characters
        body=json.dumps({"texts": [text[:2048]], "input_type": kind, "truncate": "END"}),
    )
    return json.loads(response["body"].read())["embeddings"][0]


# Polly voices per site language. "generative" is Polly's most natural, conversational engine;
# Japanese and Chinese don't have generative voices yet, so they use "neural". Telugu has no
# Polly voice at all and falls back to English speech (the text answer is still in Telugu).
# POLLY_VOICE_EN overrides the English voice (generative options: Ruth, Danielle, Joanna, Salli,
# Tiffany, Matthew, Stephen, Kenneth, Nate).
POLLY_VOICES = {
    "en": (os.getenv("POLLY_VOICE_EN", "Ruth"), "en-US", "generative"),
    "de": ("Vicki", "de-DE", "generative"),
    "fr": ("Lea", "fr-FR", "generative"),
    "hi": ("Kajal", "hi-IN", "generative"),
    "ja": ("Kazuha", "ja-JP", "neural"),
    "zh": ("Zhiyu", "cmn-CN", "neural"),
}


def _synthesize_one(text: str, voice_id: str, language_code: str, engine: str) -> bytes:
    response = _polly().synthesize_speech(
        Text=text[:3000],  # Polly's per-request limit is 3000 billed characters
        OutputFormat="mp3",
        VoiceId=voice_id,
        LanguageCode=language_code,
        Engine=engine,
    )
    return response["AudioStream"].read()


# Sentence ends in the site's languages (including the Japanese/Chinese full stop and the Hindi danda)
_SENTENCE_END = re.compile(r"(?<=[.!?。！？।])\s+")


def synthesize_speech(text: str, language: str = "en") -> bytes:
    """MP3 for the text. The generative engine takes seconds per call and grows with length, so
    the text is split into sentences that are synthesized in parallel and joined (MP3 frames from
    the same voice concatenate into one playable file)."""
    voice_id, language_code, engine = POLLY_VOICES.get(language, POLLY_VOICES["en"])
    sentences = [s for s in _SENTENCE_END.split(text.strip()) if s.strip()] or [text]
    # Merge very short fragments into the previous sentence so the voice doesn't sound choppy
    parts: list[str] = []
    for s in sentences:
        if parts and len(s) < 25:
            parts[-1] = f"{parts[-1]} {s}"
        else:
            parts.append(s)
    if len(parts) == 1:
        return _synthesize_one(parts[0], voice_id, language_code, engine)
    with ThreadPoolExecutor(max_workers=min(len(parts), 6)) as pool:
        audio = list(pool.map(lambda p: _synthesize_one(p, voice_id, language_code, engine), parts))
    return b"".join(audio)
