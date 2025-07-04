
// src/pages/AuthSuccessPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AuthSuccessPage() {
  const { saveToken } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) parse the URL query string, not the hash
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");

    if (t) {
      saveToken(t);
      // 2) optional: clean up the URL so /auth-success no longer shows ?token=…
      navigate("/dashboard", { replace: true });
    } else {
      setError("Authentication failed: no token received");
      setTimeout(() => navigate("/", { replace: true }), 2000);
    }
  }, [saveToken, navigate]);

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
