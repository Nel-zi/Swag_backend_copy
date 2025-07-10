from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import Literal, Annotated, List
from pydantic.types import conlist



class SignUpRequest(BaseModel):
    username: Annotated[str, Field(min_length=3)]
    email:    EmailStr
    password: Annotated[str, Field(min_length=8)]
    name:     Annotated[str, Field(min_length=1)]
    location_zipcode: int                          # ← new: must match one of the Location.id values
    category_ids: List[int] = Field(default_factory=list, max_items=3)              #type:ignore


class SignUpResponse(BaseModel):
    message: str
    pending: bool


class UserResponse(BaseModel):
    username: str
    email:    EmailStr
    name:     str


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"


class AuthResponse(TokenResponse):
    user: UserResponse


class CategoryOut(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True



class VerifyEmailRequest(BaseModel):
    token: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class ResendVerificationResponse(BaseModel):
    message: str


class LoginRequest(BaseModel):
    identifier: str    # can be email or username
    password:   str


class VerifyIdentifierRequest(BaseModel):
    identifier: str  # can be email or username


class VerifyIdentifierResponse(BaseModel):
    exists: bool


class ForgotPasswordRequest(BaseModel):
    identifier: str

class ForgotPasswordResponse(BaseModel):
    message: str
class ResetPasswordRequest(BaseModel):
    token: str
    password: str

class ResetPasswordResponse(BaseModel):
    message: str



class Item(BaseModel):
    id:         int
    title:      str
    subtitle:   str
    image_url:  HttpUrl
    seller:     str
    condition:  str
    price_usd:  float
    currency:   Literal["USD"] = "USD"
    live_count: int



