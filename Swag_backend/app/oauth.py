from fastapi import APIRouter, Request, Depends, HTTPException
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from .data_store import users, google_users
from .auth import create_access_token
from .config import settings
import logging

logger = logging.getLogger("uvicorn.error")
router = APIRouter()
oauth = OAuth()

# Register Google OAuth client
oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

@router.get("/auth/google/login")
async def google_login(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)         #type: ignore

@router.get("/auth/google/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)              #type: ignore
    except OAuthError as e:
        logger.error(f"OAuthError: {e.error} - {e.description}")
        raise HTTPException(status_code=400, detail="Google authentication failed")
    
    # Extract userinfo from token
    userinfo = token.get("userinfo")
    if not userinfo:
        logger.error("Userinfo missing in token response")
        raise HTTPException(400, "Failed to fetch user information")
    
    # Validate email verification
    if not userinfo.get("email_verified", False):
        logger.error(f"Unverified email attempt: {userinfo['email']}")
        raise HTTPException(400, "Google email not verified")
    
    sub = userinfo["sub"]
    email = userinfo["email"]
    name = userinfo.get("name", email.split("@")[0])

    # Map Google user to local username
    username = google_users.get(sub)
    
    if not username:
        # Check if email already exists in system
        username = next((un for un, u in users.items() if u["email"] == email), None)
        
        if not username:
            # Create new user
            username = email
            users[username] = {
                "name": name,
                "email": email,
                "hashed_password": None,
                "provider": "google"
            }
        
        # Link Google account
        google_users[sub] = username

    access_token = create_access_token(username)
    return {"access_token": access_token, "token_type": "bearer"}


#     return {
#         "jwt": access_token,                  # your app’s token
#         "google_token": token["access_token"],# Google’s access token
#         "google_id_token": token["id_token"],
# }

# @router.get("/auth/google/callback")
# async def google_callback(request: Request):
#     # … all the token/user logic …
#     access_token = create_access_token(username)

#     # Set it however your frontend expects (e.g. in a cookie or localStorage), then redirect:
#     response = RedirectResponse(url="/dashboard")
#     response.set_cookie("access_token", access_token, httponly=True)
#     return response

