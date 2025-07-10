from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware        
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from uuid import uuid4
from datetime import datetime, timedelta

# Schemas for request/response models
from ..schemas import (
    SignUpRequest,
    LoginRequest,
    TokenResponse,
    VerifyIdentifierResponse,
    VerifyIdentifierRequest,
    SignUpResponse,
    AuthResponse,                  
    UserResponse,                  
    ResendVerificationResponse,    
    ResendVerificationRequest,     
    VerifyEmailRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse           
)

# In-memory user store
from ..data_store import users

# Authentication utilities
from ..auth import hash_password, verify_password, create_access_token, verify_token   

# Sub-routers
from ..oauth import router as oauth_router
from ..root import router as root_router

# App settings
from ..config import settings

# Email sending utility
from app.utils.email import send_verification_email, send_reset_password_email

# Instantiate the Users router
router = APIRouter(tags=["Users"])

# Security scheme for protected endpoints
security = HTTPBearer()



# =============================
# === ENDPOINT: /signup      ===
# =============================
@router.post(
    "/signup",
    response_model=SignUpResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user account",
)
def signup(
    req: SignUpRequest,
    background_tasks: BackgroundTasks,
):
    # Check if username already exists
    if req.username in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    # Check if email already registered
    if any(u["email"] == req.email for u in users.values()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Generate verification token and expiration
    token = str(uuid4())
    expires_at = datetime.utcnow() + timedelta(hours=24)

    # Store user data
    users[req.username] = {                                                     #type:ignore
        "hashed_password": hash_password(req.password),
        "email": req.email,
        "name": req.name,
        "is_verified": False,
        "verification_token": token,
        "token_expires_at": expires_at,
    }

    # Send verification email asynchronously
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    background_tasks.add_task(
        send_verification_email,
        req.email,
        verification_link,
    )

    return SignUpResponse(
        pending=True,
        message="Verification email sent. Please check your inbox."
    )



# ========================================
# === ENDPOINT: /verify-email            ===
# ========================================
@router.post(
    "/verify-email",
    response_model=AuthResponse,
    summary="Verify a user's email with a token and issue a JWT",
)
def verify_email(req: VerifyEmailRequest):
    # Find the user by token
    user_record = None
    for username, data in users.items():
        if data.get("verification_token") == req.token:
            user_record = (username, data)
            break

    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )

    username, data = user_record
    # Check token expiration
    if data.get("token_expires_at") < datetime.utcnow():        #type:ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification token expired"
        )

    # Mark user as verified
    data["is_verified"] = True
    data.pop("verification_token", None)
    data.pop("token_expires_at", None)

    # Create JWT
    access_token = create_access_token({"sub": username})       #type:ignore

    return AuthResponse(
        access_token=access_token,
        user=UserResponse(
            username=username,
            email=data["email"],
            name=data.get("name"),
        )
    )



# ========================================
# === ENDPOINT: /resend-verification      ===
# ========================================
@router.post(
    "/resend-verification",
    response_model=ResendVerificationResponse,
    summary="Resend a verification email to the given address",
)
def resend_verification(
    req: ResendVerificationRequest,
    background_tasks: BackgroundTasks,
):
    # Locate user by email
    user_record = next(
        ((u, d) for u, d in users.items() if d.get("email") == req.email),
        None
    )
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with that email not found"
        )
    username, data = user_record

    if data.get("is_verified"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified"
        )

    # Generate new token
    token = str(uuid4())
    expires_at = datetime.utcnow() + timedelta(hours=24)
    data["verification_token"] = token
    data["token_expires_at"] = expires_at

    # Send email
    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    background_tasks.add_task(
        send_verification_email,
        req.email,
        verification_link,
    )

    return ResendVerificationResponse(
        message="Verification email resent. Please check your inbox."
    )



# ===============================================
# === ENDPOINT: /auth/verify-identifier        ===
# ===============================================
@router.post(
    "/auth/verify-identifier",
    response_model=VerifyIdentifierResponse,
    status_code=status.HTTP_200_OK,
    summary="Check if a user exists by email or username",
)
def verify_identifier(req: VerifyIdentifierRequest):
    for username, data in users.items():
        if username == req.identifier or data.get("email") == req.identifier:
            return {"exists": True}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )



# =============================
# === ENDPOINT: /login        ===
# =============================
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User login with either email or username",
)
def login(req: LoginRequest):
    found_username = None
    user_record = None

    # Lookup user
    for username, data in users.items():
        if username == req.identifier or data.get("email") == req.identifier:
            found_username = username
            user_record = data
            break

    # Validate credentials
    if (
        not found_username
        or not user_record
        or not verify_password(req.password, user_record["hashed_password"])
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token(found_username)
    return {"access_token": token, "token_type": "bearer"}



# =================================================
# === DEPENDENCY: get_current_username         ===
# =================================================
def get_current_username(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    token = credentials.credentials
    try:
        payload = verify_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    sub = payload.get("sub")
    if sub in users:
        return sub

    # Fallback: treat sub as email
    for username, data in users.items():
        if data.get("email") == sub:
            return username

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token subject",
        headers={"WWW-Authenticate": "Bearer"},
    )






# ======================================
# === ENDPOINT: POST /auth/forgot-password ===
# ======================================
@router.post(
    "/auth/forgot-password",
    response_model=ForgotPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Initiate password reset by sending an email with reset token",
)
def forgot_password(
    req: ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
):
    # Attempt to locate user by username or email
    user_record = next(
        ((u, d) for u, d in users.items()
         if u == req.identifier or d.get("email") == req.identifier),
        None
    )
    # Always respond success to avoid user enumeration
    if user_record:
        username, data = user_record
        # Generate reset token and expiry
        token = str(uuid4())
        expires_at = datetime.utcnow() + timedelta(hours=1)
        data["reset_token"] = token                                     #type: ignore
        data["reset_token_expires_at"] = expires_at                     #type: ignore
        # Construct reset link
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        # Send reset email asynchronously
        background_tasks.add_task(
            send_reset_password_email,
            data.get("email"),
            reset_link,
        )
    return ForgotPasswordResponse(
        message="If that account exists, you'll receive a password reset email shortly."
    )






# ======================================
# === ENDPOINT: POST /auth/reset-password ===
# ======================================
@router.post(
    "/auth/reset-password",
    response_model=ResetPasswordResponse,
    status_code=status.HTTP_200_OK,
    summary="Reset user's password using a valid reset token",
)
def reset_password(
    req: ResetPasswordRequest,
):
    # Find the user by reset token
    user_record = None
    for username, data in users.items():
        if data.get("reset_token") == req.token:
            user_record = (username, data)
            break
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    username, data = user_record
    # Check token expiry
    if data.get("reset_token_expires_at") < datetime.utcnow():  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired"
        )
    # Update password and remove reset fields
    data["hashed_password"] = hash_password(req.password)
    data.pop("reset_token", None)
    data.pop("reset_token_expires_at", None)
    return ResetPasswordResponse(
        message="Password has been reset successfully."
    )







# ===========================================
# === ENDPOINT: GET debug users (/ _debug/users) ===
# ===========================================
@router.get("/_debug/users")
def get_debug_users():
    return users



# ===========================================
# === ENDPOINT: GET user (/user)            ===
# ===========================================
@router.get("/user", response_model=dict)
def get_user(username: str = Depends(get_current_username)):
    return {"message": f"Hello, {username}"}

