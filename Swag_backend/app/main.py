from fastapi import FastAPI, Depends, HTTPException, APIRouter, status
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from .schemas import SignUpRequest, LoginRequest, TokenResponse, VerifyIdentifierResponse, VerifyIdentifierRequest
from .data_store import users
from .auth import hash_password, verify_password, create_access_token, verify_token
from .oauth import router as oauth_router
from .config import settings
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


# Define “users” router
router = APIRouter(tags=["Users"])

# Create the app
app = FastAPI()


# app.add_middleware(
#   CORSMiddleware,
#   allow_origins=["http://192.168.225.158:8000"],
#   allow_origin_regex=r"http://192\.168\.1\.\d{1,3}:\d+",   # any .1.x on any port
#   allow_credentials=True,
#   allow_methods=["*"],
#   allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root redirect
@app.get("/")
def root():
    return RedirectResponse(url="/docs")


# --- signup endpoint ---
@router.post("/signup", response_model=dict)
def signup(req: SignUpRequest):
    if req.username in users:
        raise HTTPException(400, "Username already exists")
    users[req.username] = {
        "hashed_password": hash_password(req.password),
        "email": req.email,
    }
    return {"message": "User created"}




# --- Verify identifier endpoint ---
@router.post(
    "/auth/verify-identifier",
    response_model=VerifyIdentifierResponse,
    status_code=status.HTTP_200_OK
)
def verify_identifier(req: VerifyIdentifierRequest):
    for username, data in users.items():
        if username == req.identifier or data.get("email") == req.identifier:
            return {"exists": True}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )



# --- Login endpoint ---
@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    found_username = None
    user_record = None

    # Lookup by username key or email field
    for username, data in users.items():
        if username == req.identifier or data.get("email") == req.identifier:
            found_username = username
            user_record = data
            break

    # Verify existence and password hash
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




# Instantiate the HTTP Bearer security scheme
security = HTTPBearer()



# --- Dependency to extract canonical username from token ---
def get_current_username(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    token = credentials.credentials

    try:
        payload = verify_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    sub = payload.get("sub")
    # If `sub` is already a username key, return it
    if sub in users:
        return sub

    # Otherwise, treat `sub` as an email and find the username
    for username, data in users.items():
        if data.get("email") == sub:
            return username

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token subject"
    )



@app.get("/health")
def health():
    # FastAPI sees the dict and returns a JSONResponse under the hood
    return {"status": "ok"}



# --- Protected endpoint that always sees a username ---
@router.get("/user", response_model=dict)
def get_user(username: str = Depends(get_current_username)):
    return {"message": f"Hello, {username}"}


# Adding session middleware before any routers that use it
app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_SECRET_KEY)

# Mount routers
app.include_router(router, prefix="")              # Your signup/login routes
app.include_router(oauth_router, prefix="")  # OAuth routes under /oauth