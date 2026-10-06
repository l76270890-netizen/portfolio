import base64
import binascii
import os
import re
import secrets
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from . import crud
from .auth import issue_token, require_admin, verify_password
from .database import BACKEND_DIR, Base, SessionLocal, engine, get_db
from .schemas import AdminImageUploadIn, AdminLoginIn, ContactMessageIn, SiteContentPayload

PROJECT_DIR = BACKEND_DIR.parent
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR") or PROJECT_DIR / "public" / "uploads").expanduser()
MAX_IMAGE_BYTES = 3 * 1024 * 1024
IMAGE_SIGNATURES: dict[str, tuple[bytes, bytes | None]] = {
    ".png": (b"\x89PNG\r\n\x1a\n", None),
    ".jpg": (b"\xff\xd8\xff", None),
    ".jpeg": (b"\xff\xd8\xff", None),
    ".webp": (b"RIFF", b"WEBP"),
    ".gif": (b"GIF8", None),
}
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    if not os.getenv("ADMIN_PASSWORD"):
        raise RuntimeError("ADMIN_PASSWORD is required. Set it in the project .env file before starting the API.")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        crud.initialize_database(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Portfolio API", version="1.0.0", lifespan=lifespan)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(HTTPException)
async def http_error_response(_request: Request, exc: HTTPException):
    message = exc.detail if isinstance(exc.detail, str) else "The request could not be completed."
    return JSONResponse(status_code=exc.status_code, content={"error": message}, headers=exc.headers)


@app.exception_handler(RequestValidationError)
async def validation_error_response(_request: Request, exc: RequestValidationError):
    errors = exc.errors()
    message = errors[0].get("msg", "Invalid request.") if errors else "Invalid request."
    return JSONResponse(status_code=400, content=jsonable_encoder({"error": message, "details": errors}))


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/content")
def get_public_content(db: Session = Depends(get_db)) -> dict[str, Any]:
    return crud.get_site_content(db)


@app.post("/api/contact", status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactMessageIn, db: Session = Depends(get_db)):
    crud.create_message(db, payload.model_dump())
    return {"ok": True}


@app.post("/api/admin/login")
def admin_login(payload: AdminLoginIn):
    try:
        valid = verify_password(payload.password)
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    if not valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="The password is incorrect.")
    return {"token": issue_token()}


@app.get("/api/admin/messages", dependencies=[Depends(require_admin)])
def list_messages(db: Session = Depends(get_db)):
    return [
        {
            "id": message.id,
            "name": f"{message.first_name} {message.last_name}".strip(),
            "email": message.email,
            "phone": message.phone or "",
            "message": message.message,
            "createdAt": message.created_at.isoformat(),
        }
        for message in crud.get_all_messages(db)
    ]


@app.get("/api/admin/content", dependencies=[Depends(require_admin)])
def get_admin_content(db: Session = Depends(get_db)) -> dict[str, Any]:
    return crud.get_site_content(db)


@app.put("/api/admin/content", dependencies=[Depends(require_admin)])
def save_admin_content(payload: SiteContentPayload, db: Session = Depends(get_db)):
    return crud.save_site_content(db, payload.model_dump())


@app.post("/api/admin/upload", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def upload_admin_image(payload: AdminImageUploadIn) -> dict[str, str]:
    extension = Path(payload.filename).suffix.lower()
    image = IMAGE_SIGNATURES.get(extension)
    if image is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Choose a PNG, JPG, WEBP, or GIF image.")

    encoded_limit = 4 * ((MAX_IMAGE_BYTES + 2) // 3)
    if len(payload.data) > encoded_limit:
        raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail="Images must be 3 MB or smaller.")
    try:
        image_data = base64.b64decode(payload.data, validate=True)
    except (binascii.Error, ValueError) as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image upload.") from error
    if not image_data or len(image_data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail="Images must be 3 MB or smaller.")

    signature, webp_tail = image
    if not image_data.startswith(signature) or (webp_tail and image_data[8:12] != webp_tail):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Choose a valid PNG, JPG, WEBP, or GIF image.")

    safe_name = re.sub(r"[^A-Za-z0-9._-]", "-", Path(payload.filename).stem) or "image"
    suffix = ".jpg" if extension == ".jpeg" else extension
    stored_name = f"{secrets.token_hex(12)}-{safe_name}{suffix}"
    (UPLOAD_DIR / stored_name).write_bytes(image_data)
    return {"url": f"/uploads/{stored_name}"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
