from fastapi import FastAPI, Depends, Header, HTTPException, APIRouter, status
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from .schemas import SignUpRequest, LoginRequest, TokenResponse
from .data_store import users
from .auth import hash_password, verify_password, create_access_token, verify_token
from .oauth import router as oauth_router
from .config import settings
from fastapi.middleware.cors import CORSMiddleware

# Define “users” router
router = APIRouter(tags=["Users"])

# Create the app
app = FastAPI()


# Handling Cors
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root redirect
@app.get("/")
def root():
    return RedirectResponse(url="/docs")


@router.post("/signup", response_model=dict)
def signup(req: SignUpRequest):
    if req.username in users:
        raise HTTPException(400, "Username already exists")
    users[req.username] = {
        "hashed_password": hash_password(req.password),
        "email": req.email,
    }
    return {"message": "User created"}




@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    # find the user record by email, and capture username
    found_username = None
    for username, data in users.items():
        if data.get("email") == req.email:
            found_username = username
            user_record = data
            break

    if not found_username or not user_record.get("hashed_password"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials"
        )

    if not verify_password(req.password, user_record["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials"
        )

    # embed the **username** as the token subject
    token = create_access_token(found_username)

    return {
        "access_token": token,
        "token_type": "bearer"
    }



def get_current_username(authorization: str = Header(...)) -> str:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(401, "Invalid authorization header")
    try:
        payload = verify_token(token)
        return payload["sub"]
    except Exception:
        raise HTTPException(401, "Invalid or expired token")



@router.get("/user", response_model=dict)
def get_user(username: str = Depends(get_current_username)):
    return {"message": f"Hello, {username}"}


# Add session middleware before any routers that use it
app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_SECRET_KEY)

# Mount routers
app.include_router(router, prefix="")              # Your signup/login routes
app.include_router(oauth_router, prefix="/oauth")  # OAuth routes under /oauth

