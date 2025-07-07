import base64
import hmac
import hashlib
import json
import logging

from fastapi import APIRouter, Request, HTTPException
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.responses import RedirectResponse

from .auth import create_access_token
from .config import settings
from .data_store import users, google_users

router = APIRouter(tags=["Google authentication"])
logger = logging.getLogger("uvicorn.error")

oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

def encode_state(state: dict) -> str:
    payload = json.dumps(state).encode()
    sig = hmac.new(settings.SECRET_KEY.encode(), payload, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(sig + payload).decode()

def decode_state(state_str: str) -> dict:
    try:
        data = base64.urlsafe_b64decode(state_str.encode())
        sig, payload = data[:32], data[32:]
    except Exception:
        raise HTTPException(400, "Malformed state")
    expected = hmac.new(settings.SECRET_KEY.encode(), payload, hashlib.sha256).digest()
    if not hmac.compare_digest(sig, expected):
        raise HTTPException(400, "Invalid state signature")
    return json.loads(payload.decode())





@router.get("/auth/google/login", response_class=RedirectResponse)
async def google_login(request: Request) -> RedirectResponse:
    frontendRedirectUri = request.query_params.get("redirect_uri")
    if not frontendRedirectUri or frontendRedirectUri not in settings.ALLOWED_REDIRECT_URIS:
        raise HTTPException(400, "Invalid or missing redirect_uri")
    state = encode_state({"f_redirect_uri": frontendRedirectUri})
    return await oauth.google.authorize_redirect(               #type: ignore
        request,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
        state=state
    )


@router.get("/auth/google/callback", response_class=RedirectResponse)
async def google_callback(request: Request) -> RedirectResponse:
    try:
        token = await oauth.google.authorize_access_token(request)        #type: ignore
        
        userinfo_endpoint = (
            "https://openidconnect.googleapis.com/v1/userinfo"
        )
        resp     = await oauth.google.get(userinfo_endpoint, token=token)     #type: ignore
        userinfo = resp.json()
    
    except OAuthError as e:
        logger.error("OAuthError in google_callback", extra={"error": e.error, "desc": e.description})
        raise HTTPException(400, "Google authentication failed")

    if not userinfo.get("email_verified"):
        raise HTTPException(400, "Email not verified by Google")

    sub = userinfo["sub"]
    email = userinfo["email"]
    name = userinfo.get("name", email.split("@")[0])

    # Get or create user
    username = google_users.get(sub)
    if not username:
        username = next((u for u, d in users.items() if d["email"] == email), email)
        users.setdefault(username, {
            "name": name,
            "email": email,
            "hashed_password": None,        #type:ignore
            "provider": "google"
        })
        google_users[sub] = username

    jwt = create_access_token(username)

    raw_state = request.query_params.get("state") or ""
    state = decode_state(raw_state)
    frontend_redirect = state["f_redirect_uri"]

    # Redirect with token
    return RedirectResponse(f"{frontend_redirect}?token={jwt}")

