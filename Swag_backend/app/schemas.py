from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Literal


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



class Item(BaseModel):
    id: int
    title: str
    subtitle: str
    image_url: HttpUrl
    seller: str
    condition: str
    price_usd: float
    currency: Literal["USD"] = "USD"
    live_count: int