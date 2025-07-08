// src/api/auth.js
import axios from "axios";

// read from the .env: VITE_API_BASE_URL="https://api.example.com"
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async ({ identifier, password }) => {
  const payload = { identifier, password };
  console.log("→ POST /login payload:", payload);

  try {
    const res = await axios.post(
      `${API_BASE}/login`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
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
 * @param {{ username: string; email: string; password: string; name: string }} userData
 * @returns {Promise<object>} pending status and message
 */
export const registerUser = async (userData) => {
  console.log("→ POST /signup payload:", userData);

  try {
    const res = await axios.post(
      `${API_BASE}/signup`,
      userData,
      { headers: { "Content-Type": "application/json" } }
    );
    // backend returns { pending: true, message: "Verification email sent" }
    return res.data;
  } catch (err) {
    console.error(
      "← registration error response:",
      err.response?.status,
      err.response?.data || err
    );
    throw err;
  }
};

/**
 * verifyEmail
 * @param {string} token  verification token from email link
 * @returns {Promise<object>} authentication result (e.g. { access_token, user })
 */
export const verifyEmail = async (token) => {
  try {
    const res = await axios.post(
      `${API_BASE}/verify-email`,
      { token },
      { headers: { "Content-Type": "application/json" } }
    );
    // backend returns e.g. { access_token, user }
    return res.data;
  } catch (err) {
    console.error(
      "← verify-email error response:", err.response?.status, err.response?.data || err
    );
    throw err;
  }
};

/**
 * resendVerificationEmail
 * @param {{ email: string }} data
 * @returns {Promise<object>} { message }
 */
export const resendVerificationEmail = async ({ email }) => {
  try {
    const res = await axios.post(
      `${API_BASE}/resend-verification`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data; // e.g. { message: "Verification email resent" }
  } catch (err) {
    console.error(
      "← resend-verification error response:",
      err.response?.status,
      err.response?.data || err
    );
    throw err;
  }
};

export const fetchUserProfile = async (token) => {
  try {
    const res = await axios.get(
      `${API_BASE}/user`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("Fetch profile error:", err);
    throw err;
  }
};

export const verifyIdentifier = async (identifier) => {
  try {
    await axios.post(
      `${API_BASE}/auth/verify-identifier`,
      { identifier }
    );
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

  const frontendRedirectUri = `${window.location.origin}/auth-success`;
  console.log("→ Frontend redirect_uri (to be sent to backend):", frontendRedirectUri);

  const loginUrl = new URL(`${API_BASE}/auth/google/login`);
  loginUrl.searchParams.set("redirect_uri", frontendRedirectUri);

  console.log("→ Redirecting user to backend login URL:", loginUrl.toString());
  window.location.href = loginUrl.toString();
};

/**
 * requestPasswordReset
 * @param {{ identifier: string }} data
 * @returns {Promise<object>} { message }
 */
export const requestPasswordReset = async ({ identifier }) => {
  try {
    const res = await axios.post(
      `${API_BASE}/auth/forgot-password`,
      { identifier },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data; // e.g. { message: "Reset email sent" }
  } catch (err) {
    console.error(
      "← forgot-password error response:",
      err.response?.status,
      err.response?.data || err
    );
    throw err;
  }
};

/**
 * resetPassword
 * @param {{ token: string; password: string }} data
 * @returns {Promise<object>} { message }
 */
export const resetPassword = async ({ token, password }) => {
  try {
    const res = await axios.post(
      `${API_BASE}/auth/reset-password`,
      { token, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data; // e.g. { message: "Password reset successful" }
  } catch (err) {
    console.error(
      "← reset-password error response:",
      err.response?.status,
      err.response?.data || err
    );
    throw err;
  }
};
