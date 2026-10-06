import os
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from . import crud
from .auth import issue_token, require_admin, verify_password
from .database import BACKEND_DIR, Base, SessionLocal, engine, get_db
from .schemas import AdminLoginIn, ContactMessageIn, SiteContentPayload

PROJECT_DIR = BACKEND_DIR.parent


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
