# Auction Marketplace MVP API

This README provides clear guidance for the front-end on how to connect to the backend API, integrate the JWT login and signup functionality on the front-end, whilst testing the available endpoints.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Launching the Server](#launching-the-server)
6. [CORS Configuration](#cors-configuration)
7. [API Endpoints](#api-endpoints)
   - [Signup](#1-signup)
   - [Login](#2-login)
   - [Get Current User](#3-get-current-user)
8. [Schemas & Models](#schemas--models)
9. [Testing & API Collection](#testing--api-collection)
10. [Example cURL Requests](#example-curl-requests)

---

## Project Overview

An MVP back-end for an auction marketplace (similar to Whatnot) that currently supports:

- User signup (`/signup`)
- User login with JWT (`/login`)
- Retrieve current authenticated user information (`/user`)

All endpoints are built with FastAPI and protected via JSON Web Tokens.

---

## Prerequisites

- **Python 3.12.0**
- Git (for cloning)
- A terminal or shell supporting Python virtual environments

---

## Installation

1. Clone the repository and navigate into the `Swag_backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # macOS/Linux
   .\.venv\\Scripts\\activate # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Environment Variables

Create a `.env` file in the project root (`Swag_backend/`).

At minimum, include any variables used by the auth logic (e.g. `JWT_SECRET_KEY`, database URL, etc.).

> **Note:** Reach out for the exact variable names and example values.

---

## Launching the Server

With your virtual environment activated, run:

```bash
fastapi dev app/main.py
```

By default, the API will be served at:

```
http://127.0.0.1:8000
```

---

## CORS Configuration

For ease of testing, all origins are currently allowed:

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## API Endpoints

### 1. Signup

- **Method:** `POST`
- **Path:** `/signup`
- **URL:** `http://127.0.0.1:8000/signup`
- **Description:** Create a new user account.
- **Request Body (JSON):**
  ```json
  {
    "username": "string",
    "email": "user@example.com",
    "password": "string"
  }
  ```
- **Responses:**
  - `200 OK` (or `201 Created`): user created (no fixed schema; front-end may adapt)
  - `400 Bad Request`: invalid input or duplicate user

### 2. Login

- **Method:** `POST`
- **Path:** `/login`
- **URL:** `http://127.0.0.1:8000/login`
- **Description:** Authenticate an existing user and receive a JWT.
- **Request Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "string"
  }
  ```
- **Response Body (JSON):**
  ```json
  {
    "access_token": "<JWT_TOKEN>",
    "token_type": "bearer"
  }
  ```
- **Error Codes:**
  - `400 Bad Request`: wrong credentials

### 3. Get Current User

- **Method:** `GET`
- **Path:** `/user`
- **URL:** `http://127.0.0.1:8000/user`
- **Description:** Retrieve details for the currently authenticated user.
- **Headers:**
  ```http
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Responses:**
  - `200 OK`: returns user info (no strict schema; adapt at discretion)
  - `401 Unauthorized`: missing or invalid token

---

## Schemas & Models

Located in `app/schemas.py`:

- `SignUpRequest` (username, email, password)
- `LoginRequest` (email, password)
- `TokenResponse` (access\_token, token\_type)

Use these Pydantic models as a reference for request/response shapes.

---

## Testing & API Collection

- A Postman collection and environment are included in the `postman/` folder. Import into Postman to run through all endpoints.

---

## Example cURL Requests

```bash
# Signup
curl -X POST http://127.0.0.1:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"secret"}'

# Login
curl -X POST http://127.0.0.1:8000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret"}'

# Get Current User
curl -X GET http://127.0.0.1:8000/user \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

> For any questions, missing env variable details, or additional endpoints, please reach out to the back-end maintainer. Happy coding!

