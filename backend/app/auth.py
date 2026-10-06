import hashlib
import hmac
import os
import time
from base64 import urlsafe_b64decode, urlsafe_b64encode
from fastapi import HTTPException, Request, status

TOKEN_TTL_SECONDS = 12 * 60 * 60


def _secret() -> bytes:
    password = os.getenv("ADMIN_PASSWORD")
    if not password:
        raise RuntimeError("ADMIN_PASSWORD must be configured before starting the API.")
    return password.encode("utf-8")


def issue_token() -> str:
    expires_at = str(int(time.time()) + TOKEN_TTL_SECONDS).encode("ascii")
    payload = urlsafe_b64encode(expires_at).rstrip(b"=")
    signature = hmac.new(_secret(), payload, hashlib.sha256).digest()
    return f"{payload.decode('ascii')}.{urlsafe_b64encode(signature).rstrip(b'=').decode('ascii')}"


def verify_password(password: str) -> bool:
    return hmac.compare_digest(password.encode("utf-8"), _secret())


def require_admin(request: Request) -> None:
    authorization = request.headers.get("authorization", "")
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token or "." not in token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please sign in again.")

    payload, supplied_signature = token.split(".", 1)
    expected_signature = hmac.new(_secret(), payload.encode("ascii", "ignore"), hashlib.sha256).digest()
    try:
        decoded_signature = urlsafe_b64decode(supplied_signature + "=" * (-len(supplied_signature) % 4))
        expires_at = int(urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))
    except (ValueError, TypeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please sign in again.") from None

    if not hmac.compare_digest(decoded_signature, expected_signature) or expires_at <= int(time.time()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Please sign in again.")
