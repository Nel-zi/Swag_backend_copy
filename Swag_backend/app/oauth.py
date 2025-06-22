# from fastapi import APIRouter, Request, Depends, HTTPException
# from starlette.responses import RedirectResponse
# from authlib.integrations.starlette_client import OAuth, OAuthError
# from .data_store import users, google_users
# from .auth import create_access_token
# from .config import settings
# import logging
# from authlib.integrations.starlette_client import OAuthError

# logger = logging.getLogger("uvicorn.error")
# router = APIRouter()
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
#     response = await oauth.google.authorize_redirect(request, redirect_uri)
#     stored = request.session.get("oauth_google_state")
#     logger.info(f"OAuth state stored in session before redirect: {stored}")
#     return response



# @router.get("/auth/google/callback")
# async def google_callback(request: Request):
#     logger.info(f"Callback query params: {dict(request.query_params)}")
#     stored = request.session.get("oauth_google_state")
#     incoming = request.query_params.get("state")
#     logger.info(f"Stored state: {stored}, incoming state: {incoming}")
#     try:
#         token = await oauth.google.authorize_access_token(request)

#     except OAuthError as e:
#         logger.error(f"OAuthError: {getattr(e,'error',str(e))} / {getattr(e,'description',None)}")
#         logger.exception("Stacktrace for OAuthError")
#         raise HTTPException(400, "Google authentication failed")




#     # userinfo contains 'sub', 'email', 'name'
#     sub = userinfo['sub']
#     email = userinfo.get('email')
#     # Map Google user to local username
#     username = google_users.get(sub)
#     if not username:
#         # First time login: create local user
#         username = email
#         users[username] = { 'hashed_password': None, 'email': email }
#         google_users[sub] = username

#     access_token = create_access_token(username)
#     # Redirect or return token
#     return { 'access_token': access_token, 'token_type': 'bearer' }










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
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
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