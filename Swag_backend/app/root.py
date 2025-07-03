from fastapi import APIRouter
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from .data_store import users, google_users
from .config import settings

router = APIRouter(tags=["Root"])

oauth = OAuth()

# Root redirect
@router.get("/")
def root():
    return RedirectResponse(url="/docs")


@router.get("/health")
def health():
    # FastAPI sees the dict and returns a JSONResponse under the hood
    return {"status": "ok"}