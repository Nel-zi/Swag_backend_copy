from datetime import datetime
from typing import TypedDict, Optional

# ----------------------------------------------------------------
# User record and in-memory store
# ----------------------------------------------------------------
class UserRecord(TypedDict):
    hashed_password: str
    email: str
    name: str
    is_verified: bool
    verification_token: Optional[str]
    token_expires_at: Optional[datetime]

# username → UserRecord
users: dict[str, UserRecord] = {}

# OAuth mapping: google_sub → username
google_users: dict[str, str] = {}

# ----------------------------------------------------------------
# Item record and in-memory catalog
# ----------------------------------------------------------------
class ItemRecord(TypedDict):
    id: int
    title: str
    subtitle: str
    image_url: str
    seller: str
    condition: str
    price_usd: float
    live_count: int

# Global catalog of items (all authenticated users can browse)
items: list[ItemRecord] = [
    {
        "id": 1,
        "title": "Men’s Sneakers",
        "subtitle": "Sneakers • Starts $1,000",
        "image_url": "https://images.app.goo.gl/DEiwCgVuUsUXVk2XA",  
        "seller": "nikestores",
        "condition": "Used | Astroloubi",
        "price_usd": 1000.0,
        "live_count": 25,
    },
    # … add more items here …
]
