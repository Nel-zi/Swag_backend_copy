// src/api/auth.js
import axios from "axios";

// read from your .env: VITE_API_BASE_URL="https://api.example.com"
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async ({ identifier, password }) => {
  // send the exact schema your backend validates:
  const payload = { identifier, password };

  console.log("→ POST /login payload:", payload);

  try {
    const res = await axios.post(`${API_BASE}/login`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data; // e.g. { access_token, ... }
  } catch (err) {
    console.error(
      "← login error response:",
      err.response?.status,
      err.response?.data || err
    );
    throw err;
  }
};


/**
 * registerUser
 * @param {{ username: string; email: string; password: string }} userData
 * @returns {Promise<object>} newly created user (or whatever your API returns)
 */
export const registerUser = async (userData) => {
  // e.g. { username, email, password }
  console.log("→ POST /auth/register payload:", userData);

  try {
    const res = await axios.post(
      `${API_BASE}/signup`,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data; // e.g. { id, username, email, ... }
  } catch (err) {
    console.error("← registration error response:", err.response?.status, err.response?.data || err);
    throw err;
  }
};





export const fetchUserProfile = async (token) => {
  try {
    const res = await axios.get(`${API_BASE}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // your user object
  } catch (err) {
    console.error("Fetch profile error:", err);
    throw err;
  }
};

export const verifyIdentifier = async (identifier) => {
  // optional: check if email/username already exists
  try {
    await axios.post(`${API_BASE}/auth/verify-identifier`, { identifier });
    return true;
  } catch (err) {
    const detail = err.response?.data?.detail;
    const msg = Array.isArray(detail) ? detail[0]?.msg : detail || "Not found";
    throw new Error(msg);
  }
};



export const googleLogin = () => {
  if (!API_BASE) {
    console.error("VITE_API_BASE_URL is undefined!");
    return;
  }

  // This is our frontend callback URL (not Google’s)
  const frontendRedirectUri = `${window.location.origin}/auth-success`;
  console.log("→ Frontend redirect_uri (to be sent to backend):", frontendRedirectUri);

  // Build the URL for our backend’s Google-login endpoint
  // The backend will receive our frontendRedirectUri and then
  // redirect the user on to Google’s OAuth endpoint.
  const loginUrl = new URL(`${API_BASE}/auth/google/login`);
  loginUrl.searchParams.set("redirect_uri", frontendRedirectUri);

  console.log("→ Redirecting user to backend login URL:", loginUrl.toString());
  window.location.href = loginUrl.toString();
};

