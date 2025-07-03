import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

// AuthSuccessPage: handles the OAuth callback and token extraction
export default function AuthSuccessPage() {
  const { saveToken } = useAuth();  // get function to store token
  const navigate = useNavigate();   // for redirecting within SPA
  const [error, setError] = useState(null);  // local error state

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1)); // parse hash
    const t = hashParams.get("token");  // get 'token' param

    if (t) {
      saveToken(t);                  // save token in state/storage
      window.location.hash = "";   // clear URL fragment
      navigate("/dashboard", { replace: true });  // go to dashboard
    } else {
      setError('Authentication failed: no token received');  // set error message
      setTimeout(() => navigate("/", { replace: true }), 2000);  // redirect back
    }
  }, [saveToken, navigate]);  // run once on component mount

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