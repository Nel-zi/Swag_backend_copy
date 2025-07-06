// src/pages/AuthSuccessPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AuthSuccessPage() {
  const { saveToken, token } = useAuth();    // get token from context
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // On mount: parse and save the token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      saveToken(urlToken);
    } else {
      setError("Authentication failed: no token received");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    }
  }, [saveToken, navigate]);

  // After token is set in context, navigate to dashboard
  useEffect(() => {
    if (token) {
      // cleanup the URL so the token isn't visible
      window.history.replaceState(null, "", window.location.pathname);
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>Signing you in…</p>
      )}
    </div>
  );
}
