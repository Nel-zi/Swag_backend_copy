from pydantic_settings import BaseSettings
from typing import Optional, List
from pydantic import AnyHttpUrl



class Settings(BaseSettings):
    JWT_SECRET: str
    JWT_ALGORITHM: str
    JWT_EXP_SECONDS: int
    SESSION_SECRET_KEY: str

     # OAuth2 settings
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str

    # front‑end URLs you trust your users to be redirected back to
    ALLOWED_REDIRECT_URIS: str
    SECRET_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        # this makes Pydantic read JWT_SECRET → jwt_secret, etc.
        case_sensitive = False

        #<<< add this so comma‑separated env values become Python lists
        # env_nested_delimiter = ","

settings = Settings()           # type: ignore