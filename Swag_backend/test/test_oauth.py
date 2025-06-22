# test/test_oauth.py

import pytest
from fastapi.testclient import TestClient
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuthError

from app.main import app
import app.oauth as oauth_module   # <-- we need the module itself

client = TestClient(app)

class DummyToken:
    access_token = "fake-access-token"
    id_token = "fake-id-token"
    token_type = "Bearer"

@pytest.fixture(autouse=True)
def mock_google_and_jwt(monkeypatch):
    # 1) Stub out the OAuth redirect to Google:
    monkeypatch.setattr(
        oauth_module.oauth.google,
        "authorize_redirect",
        lambda request, uri: RedirectResponse("redirected-to-google", status_code=302)
    )

    # 2) Stub the code→token exchange:
    async def fake_exchange(request):
        return {
            "access_token": DummyToken.access_token,
            "id_token": DummyToken.id_token,
            "token_type": DummyToken.token_type,
        }
    monkeypatch.setattr(
        oauth_module.oauth.google,
        "authorize_access_token",
        fake_exchange
    )

    # 3) Stub ID-token parsing:
    async def fake_parse(request, token):
        return {"sub": "1234", "email": "you@example.com", "name": "Test User"}
    monkeypatch.setattr(
        oauth_module.oauth.google,
        "parse_id_token",
        fake_parse
    )

    # 4) Stub your JWT factory **inside** the oauth module:
    monkeypatch.setattr(
        oauth_module,
        "create_access_token",
        lambda username: DummyToken.access_token
    )

    yield

def test_login_redirects():
    # HTTPX/TestClient uses `follow_redirects`, not `allow_redirects`
    resp = client.get("/auth/google/login", follow_redirects=False)
    assert resp.status_code == 302
    assert resp.headers["location"] == "redirected-to-google"

def test_callback_exchanges_and_returns_token():
    # Simulate Google redirecting back with code & state
    resp = client.get("/auth/google/callback?code=foo&state=bar")
    assert resp.status_code == 200

    body = resp.json()
    assert body["access_token"] == DummyToken.access_token
    assert body["token_type"].lower() == "bearer"
