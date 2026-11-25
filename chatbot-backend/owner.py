"""Who the portfolio belongs to, for the AI prompts, emails and spoken prompts. Set these as
environment variables (Lambda configuration, or chatbot-backend/.env locally); they mirror
site.config.js in the frontend.

    OWNER_NAME             full display name               "Satya Bulusu"
    OWNER_FIRST_NAME       short name used in messages     "Satya"
    OWNER_PRONOUNS         subject/object/possessive       "he/him/his", "she/her/her", "they/them/their"
    OWNER_LOCALIZED_NAMES  first name in other scripts     '{"hi": "सत्या", "te": "సత్య"}'  (JSON, optional)
    SITE_URL               the portfolio's address          "https://gautamportfolio.com"
"""
import json
import os

OWNER_NAME = os.getenv("OWNER_NAME", "Satya Bulusu")
OWNER_FIRST_NAME = os.getenv("OWNER_FIRST_NAME") or OWNER_NAME.split()[0]
SITE_URL = os.getenv("SITE_URL", "https://gautamportfolio.com").rstrip("/")
SITE_HOST = SITE_URL.replace("https://", "").replace("http://", "")

_pronouns = (os.getenv("OWNER_PRONOUNS") or "he/him/his").split("/")
SUBJECT, OBJECT, POSSESSIVE = (_pronouns + ["they", "them", "their"][len(_pronouns):])[:3]

_default_localized = '{"hi": "सत्या", "te": "సత్య"}' if OWNER_FIRST_NAME == "Satya" else "{}"
try:
    LOCALIZED_FIRST_NAMES: dict = json.loads(os.getenv("OWNER_LOCALIZED_NAMES") or _default_localized)
except ValueError:
    LOCALIZED_FIRST_NAMES = {}


def first_name(language: str = "en") -> str:
    return LOCALIZED_FIRST_NAMES.get(language, OWNER_FIRST_NAME)


def cap(word: str) -> str:
    return word[:1].upper() + word[1:]
