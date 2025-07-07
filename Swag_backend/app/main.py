from fastapi import FastAPI, Depends, HTTPException, APIRouter, Request, Response
from starlette.middleware.sessions import SessionMiddleware

from .config import settings
from .schemas import Item
from .data_store import users
from .oauth import router as oauth_router
from .root import router as root_router
from .routers.users import router as users_router
from .routers.users import get_current_username
from .data_store import items

from fastapi.middleware.cors import CORSMiddleware
from typing import List



# Define “users” router
router = APIRouter(tags=["Items"])


# Create the app
app = FastAPI()


# app.add_middleware(
#   CORSMiddleware,
#   allow_origins=["http://192.168.225.158:8000"],
#   allow_origin_regex=r"http://192\.168\.1\.\d{1,3}:\d+",   # any .1.x on any port
#   allow_credentials=True,
#   allow_methods=["*"],
#   allow_headers=["*"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# ==== GET ITEMS ==== #
@router.get(
    "/api/items",
    response_model=List[Item],
    summary="List all items (protected catalog)"
)
def get_items(current_user: str = Depends(get_current_username)):
    """
    Returns the global catalog of items. Requires a valid JWT.
    """
    # Simply return the pre‑seeded `items` from data_store.py
    return items




# Session middleware: must be added _before_ any handler that expects `request.session` to exist.
app.add_middleware(SessionMiddleware, secret_key=settings.SESSION_SECRET_KEY)


@app.middleware("http")
async def add_csp_header(request: Request, call_next):
    response: Response = await call_next(request)

    # If this is any of the docs or swagger-ui static assets, don't add CSP
    docs_paths = (
        "/docs",             # the HTML
        "/openapi.json",     # the spec
        "/redoc",            # if ReDoc is used
        "/static/swagger-ui" # the JS/CSS under FastAPI’s static mount
    )
    if not request.url.path.startswith(docs_paths):
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self'; "
            "style-src 'self'; "
            "object-src 'none'; "
            "base-uri 'none'; "
            "frame-ancestors 'none';"
        )
    return response

# Mount the routers, Order matters on swagger
app.include_router(users_router, prefix="")
app.include_router(oauth_router, prefix="")      
app.include_router(root_router, prefix="")     
app.include_router(router, prefix="")           


