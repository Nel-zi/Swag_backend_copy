from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str
    JWT_EXP_SECONDS: int
    SESSION_SECRET_KEY: str

     # OAuth2 settings
    GOOGLE_CLIENT_ID:    Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI:  str           = "http://localhost:8000/auth/google/callback"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # this makes Pydantic read JWT_SECRET → jwt_secret, etc.
        case_sensitive = False

settings = Settings()           # type: ignore