from pydantic_settings import BaseSettings
from typing import Optional, List
from pydantic import Field

class Settings(BaseSettings):
    # JWT
    JWT_SECRET:     str
    JWT_ALGORITHM:  str
    JWT_EXP_SECONDS: int

    # Session
    SESSION_SECRET_KEY: str

    # OAuth2
    GOOGLE_CLIENT_ID:     Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI:  str

    # Front‑end
    ALLOWED_REDIRECT_URIS: str
    SECRET_KEY:            str
    FRONTEND_URL: str

    # ─── Email / SMTP settings ───────────────────────────────────────────────
    smtp_host:     str
    smtp_port:     int
    smtp_user:     str
    smtp_password: str
    from_address:  Optional[str]
    # ──────────────────────────────────────────────────────────────────────────

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "forbid"    # catch typos in your .env

settings = Settings()  # type: ignore
