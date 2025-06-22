# In-memory stores
# users: username -> {hashed_password, email}
users: dict[str, dict] = {}

# oauth mapping: google sub -> username
google_users: dict[str, str] = {}