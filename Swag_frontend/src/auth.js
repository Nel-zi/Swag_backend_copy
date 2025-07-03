// Simple in-memory auth store (can be replaced with context or localStorage as needed)
let authData = {
  email: null,
  token: null,
};

export function setAuthData({ email, token }) {
  if (email !== undefined) authData.email = email;
  if (token !== undefined) authData.token = token;
}

export function getAuthData() {
  return { ...authData };
}

export function clearAuthData() {
  authData.email = null;
  authData.token = null;
}

// Static credentials for demo authentication
export const AUTH_EMAIL = "josh@gmail.com";
export const AUTH_PASSWORD = "josh@josh";
