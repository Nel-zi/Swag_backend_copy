from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str
    JWT_EXP_SECONDS: int
    SESSION_SECRET_KEY: str

     # OAuth2 settings—optional
    GOOGLE_CLIENT_ID:    Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI:  str           = "http://localhost:8000/auth/google/callback"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # this makes Pydantic read JWT_SECRET → jwt_secret, etc.
        case_sensitive = False

settings = Settings()           # type: ignore



# print("→ JWT_EXP_SECONDS:", repr(settings.JWT_EXP_SECONDS))
# print("→ JWT_ALGORITHM :", repr(settings.JWT_ALGORITHM))
# print("→ JWT_SECRET    :", "SET" if settings.JWT_SECRET else "MISSING or BLANK")


# from dotenv import load_dotenv

# load_dotenv()

# JWT_EXP_SECONDS = int(os.getenv("JWT_EXP_SECONDS"))
# JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
# JWT_SECRET = os.getenv("JWT_SECRET")

# # Google OAuth2 credentials (set these as env variables)
# GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
# GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")

