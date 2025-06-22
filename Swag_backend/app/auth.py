import time
from passlib.hash import bcrypt
from jose import jwt
from .config import settings


JWT_SECRET = settings.JWT_SECRET
JWT_ALGORITHM = settings.JWT_ALGORITHM
JWT_EXP_SECONDS = settings.JWT_EXP_SECONDS


# Password hashing
def hash_password(password: str) -> str:
    return bcrypt.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.verify(plain, hashed)

# JWT utilities
def create_access_token(subject: str) -> str:
    now = int(time.time())
    payload = {"sub": subject, "iat": now, "exp": now + JWT_EXP_SECONDS}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
