from datetime import datetime
from typing import TypedDict, Optional, List

# ----------------------------------------------------------------
# Category record and in-memory catalog
# ----------------------------------------------------------------
class CategoryRecord(TypedDict):
    id: int
    name: str

# Pre-populated categories (id → name)
categories: List[CategoryRecord] = [
    {"id": 1, "name": "Tech"},
    {"id": 2, "name": "Finance"},
    {"id": 3, "name": "Health"},
    {"id": 4, "name": "Education"},
    {"id": 5, "name": "Entertainment"},
]

# Helper to list category IDs
def list_category_ids() -> List[int]:
    return [c["id"] for c in categories]










# ----------------------------------------------------------------
# Location record and in-memory catalog
# ----------------------------------------------------------------
# class LocationRecord(TypedDict):
#     id: int
#     name: str

# # Pre-populated locations (id → name)
# locations: List[LocationRecord] = [
#     {"id": 1, "name": "Nairobi"},
#     {"id": 2, "name": "Lagos"},
#     {"id": 3, "name": "New York"},
#     {"id": 4, "name": "London"},
#     {"id": 5, "name": "Tokyo"},
# ]

# # Helper to list location IDs
# def list_location_ids() -> List[int]:
#     return [l["id"] for l in locations]









# ----------------------------------------------------------------
# User record and in-memory store
# ----------------------------------------------------------------
class UserRecord(TypedDict):
    hashed_password: str
    email: str
    name: str
    location_zipcode: int            # selected location ID
    categories: List[int]       # up to 3 selected category IDs
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
items: List[ItemRecord] = [
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

# ----------------------------------------------------------------
# Example registration logic (pseudo)
# ----------------------------------------------------------------
def register_user(username: str, data: dict) -> UserRecord:
    # Validate categories
    selected = data.get("categories", [])
    if len(selected) > 3:
        raise ValueError("You can select up to 3 categories only.")
    invalid_cats = [c for c in selected if c not in list_category_ids()]
    if invalid_cats:
        raise ValueError(f"Invalid category IDs: {invalid_cats}")


    record: UserRecord = {
        "hashed_password": data["hashed_password"],
        "email": data["email"],
        "name": data["name"],
        "location_zipcode": data["location_zipcode"],
        "categories": selected,
        "is_verified": False,
        "verification_token": data.get("verification_token"),
        "token_expires_at": data.get("token_expires_at"),
    }
    users[username] = record
    return record

