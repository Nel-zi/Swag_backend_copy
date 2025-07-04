from pydantic import BaseModel, EmailStr

class SignUpRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    identifier: str    # can be email or username
    password: str


class VerifyIdentifierRequest(BaseModel):
    identifier: str  # can be email or username


class VerifyIdentifierResponse(BaseModel):
    exists: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


