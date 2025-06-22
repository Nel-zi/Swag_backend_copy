from fastapi import FastAPI, Depends, Header, HTTPException
from .schemas import SignUpRequest, LoginRequest, TokenResponse
from .data_store import users
from .auth import hash_password, verify_password, create_access_token, verify_token
from .oauth import router as oauth_router
from starlette.middleware.sessions import SessionMiddleware
from .config import settings


app = FastAPI()
# Include OAuth routes
app.include_router(oauth_router)

# — Add this before you include any routers that use OAuth —  
# Use a long, random secret for production!
app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_SECRET_KEY)

# then include your OAuth router
app.include_router(oauth_router)



# Dependency: get current user from Authorization header
def get_current_username(authorization: str = Header(...)) -> str:
    scheme, _, token = authorization.partition(' ')
    if scheme.lower() != 'bearer' or not token:
        raise HTTPException(401, 'Invalid authorization header')
    try:
        payload = verify_token(token)
        return payload['sub']
    except Exception:
        raise HTTPException(401, 'Invalid or expired token')

@app.post('/signup', response_model=dict)
def signup(req: SignUpRequest):
    if req.username in users:
        raise HTTPException(400, 'Username already exists')
    users[req.username] = {
        'hashed_password': hash_password(req.password),
        'email': req.email
    }
    return {'message': 'User created'}

@app.post('/login', response_model=TokenResponse)
def login(req: LoginRequest):
    user = users.get(req.username)
    if not user or not user['hashed_password']:
        raise HTTPException(400, 'Invalid credentials')
    if not verify_password(req.password, user['hashed_password']):
        raise HTTPException(400, 'Invalid credentials')
    token = create_access_token(req.username)
    return {'access_token': token}

@app.get('/protected', response_model=dict)
def protected(username: str = Depends(get_current_username)):
    return {'message': f'Hello, {username}'}
