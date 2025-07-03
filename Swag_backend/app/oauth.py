# from fastapi import APIRouter, Request, Depends, HTTPException
# from starlette.responses import RedirectResponse
# from authlib.integrations.starlette_client import OAuth, OAuthError
# from .data_store import users, google_users
# from .auth import create_access_token
# from .config import settings
# import logging

# router = APIRouter(tags=["Google oauth"])

# logger = logging.getLogger("uvicorn.error")
# oauth = OAuth()

# # Register Google OAuth client
# oauth.register(
#     name="google",
#     client_id=settings.GOOGLE_CLIENT_ID,
#     client_secret=settings.GOOGLE_CLIENT_SECRET,
#     server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
#     client_kwargs={"scope": "openid email profile"},
# )

# @router.get("/auth/google/login")
# async def google_login(request: Request):
#     redirect_uri = settings.GOOGLE_REDIRECT_URI
#     return await oauth.google.authorize_redirect(request, redirect_uri)         #type: ignore

# @router.get("/auth/google/callback")
# async def google_callback(request: Request):
#     try:
#         token = await oauth.google.authorize_access_token(request)              #type: ignore
#     except OAuthError as e:
#         logger.error(f"OAuthError: {e.error} - {e.description}")
#         raise HTTPException(status_code=400, detail="Google authentication failed")
    
#     # Extract userinfo from token
#     userinfo = token.get("userinfo")
#     if not userinfo:
#         logger.error("Userinfo missing in token response")
#         raise HTTPException(400, "Failed to fetch user information")
    
#     # Validate email verification
#     if not userinfo.get("email_verified", False):
#         logger.error(f"Unverified email attempt: {userinfo['email']}")
#         raise HTTPException(400, "Google email not verified")
    
#     sub = userinfo["sub"]
#     email = userinfo["email"]
#     name = userinfo.get("name", email.split("@")[0])

#     # Map Google user to local username
#     username = google_users.get(sub)
    
#     if not username:
#         # Check if email already exists in system
#         username = next((un for un, u in users.items() if u["email"] == email), None)
        
#         if not username:
#             # Create new user
#             username = email
#             users[username] = {
#                 "name": name,
#                 "email": email,
#                 "hashed_password": None,
#                 "provider": "google"
#             }
        
#         # Link Google account
#         google_users[sub] = username

#     access_token = create_access_token(username)
#     return {"access_token": access_token, "token_type": "bearer"}






import base64
import hmac
import hashlib
import json
import logging

from fastapi import APIRouter, Request, HTTPException
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError

from .auth import create_access_token
from .config import settings
from .data_store import users, google_users

router = APIRouter()
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
    redirect_uri = request.query_params.get("redirect_uri")
    if not redirect_uri or redirect_uri not in settings.ALLOWED_REDIRECT_URIS:
        raise HTTPException(400, "Invalid or missing redirect_uri")
    state = encode_state({"redirect_uri": redirect_uri})
    return await oauth.google.authorize_redirect(
        request,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
        state=state
    )


@router.get("/auth/google/callback", response_class=RedirectResponse)
async def google_callback(request: Request) -> RedirectResponse:
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        logger.error("OAuthError in google_callback", extra={"error": e.error, "desc": e.description})
        raise HTTPException(400, "Google authentication failed")

    userinfo = token.get("userinfo") or {}
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
            "hashed_password": None,
            "provider": "google"
        })
        google_users[sub] = username

    jwt = create_access_token(username)

    raw_state = request.query_params.get("state") or ""
    state = decode_state(raw_state)
    frontend_redirect = state["redirect_uri"]

    # Redirect with token (consider HttpOnly cookie in real apps)
    return RedirectResponse(f"{frontend_redirect}?token={jwt}")


