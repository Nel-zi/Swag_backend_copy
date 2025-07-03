import React from "react";

// LoginPage: renders a button that starts Google OAuth
export default function LoginPage() {
  // handleLogin: event handler for login button click
  const handleLogin = () => {
    const redirectUri = window.location.origin + "/auth-success";  // Callback URL
    const loginUrl =
      "https://swag-backend.onrender.com/auth/google/login?" +
      `redirect_uri=${encodeURIComponent(redirectUri)}`;  // Full login URL
    window.location.href = loginUrl;  // Redirect to backend OAuth endpoint
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Sign in with Google</h1>
      <button
        onClick={handleLogin}            // Attach click handler
        style={{ padding: "1rem", fontSize: "1rem" }}
      >
        Sign In
      </button>
    </div>
  );
}