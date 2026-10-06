import json
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from .models import ContactMessage, SiteContent

PROJECT_DIR = Path(__file__).resolve().parents[2]
DEFAULT_CONTENT_PATH = PROJECT_DIR / "server" / "default-content.json"


def load_default_content() -> dict[str, Any]:
    try:
        with DEFAULT_CONTENT_PATH.open(encoding="utf-8") as content_file:
            return json.load(content_file)
    except (OSError, json.JSONDecodeError) as error:
        raise RuntimeError(f"Could not load default portfolio content: {error}") from error


def get_site_content(db: Session) -> dict[str, Any]:
    record = db.get(SiteContent, 1)
    if not record:
        return load_default_content()
    try:
        saved = json.loads(record.data)
    except (TypeError, json.JSONDecodeError) as error:
        raise RuntimeError("Saved portfolio content is invalid JSON.") from error
    return {**load_default_content(), **saved}


def save_site_content(db: Session, payload: dict[str, Any]) -> dict[str, Any]:
    content_json = json.dumps(payload, ensure_ascii=False)
    record = db.get(SiteContent, 1)

    if record is None:
        record = SiteContent(id=1, data=content_json)
        db.add(record)
    else:
        record.data = content_json

    db.commit()
    return payload


def get_all_messages(db: Session) -> list[ContactMessage]:
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


def create_message(db: Session, payload: dict[str, Any]) -> ContactMessage:
    message = ContactMessage(
        first_name=payload["firstName"].strip(),
        last_name=payload["lastName"].strip(),
        email=payload["email"].strip(),
        phone=(payload.get("phone") or "").strip()[:40],
        message=payload["message"].strip(),
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def initialize_database(db: Session) -> None:
    if db.get(SiteContent, 1) is None:
        db.add(SiteContent(id=1, data=json.dumps(load_default_content(), ensure_ascii=False)))
        db.commit()
