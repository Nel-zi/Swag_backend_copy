// src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { resendVerificationEmail } from "../api/auth";

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth();
  const location = useLocation();
  const [params] = useSearchParams();

  // Check if we navigated here from signup
  const pending = location.state?.pending;
  // Prefill email if passed in navigation state
  const initialEmail = location.state?.email || "";
  // Extract token from email link query param
  const token = params.get("token");

  // Determine initial status
  const [status, setStatus] = useState(
    pending ? "pending" : token ? "verifying" : "idle"
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);

  // If token present, automatically verify
  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then(() => setStatus("success"))
        .catch(() => setStatus("error"));
    }
  }, [token, verifyEmail]);

  // Resend verification email
  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await resendVerificationEmail({ email });
      setMessage(res.message || "Check your inbox for a new link.");
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render by status
  if (status === "pending") {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Almost There!</h1>
        <p>A verification link has been sent to your email. Please check your inbox.</p>
        <form onSubmit={handleResend} className="mt-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded"
          >
            {loading ? "Resending…" : "Resend Link"}
          </button>
        </form>
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  if (status === "verifying") {
    return <p className="text-center mt-12">Verifying your email…</p>;
  }

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-2xl font-semibold mb-4">Verification Failed</h1>
        <p>The link is invalid or expired.</p>
        <p className="mt-2">You can re‑enter your email to get a new link:</p>
        <form onSubmit={handleResend} className="mt-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded"
          >
            {loading ? "Resending…" : "Resend Link"}
          </button>
        </form>
        {message && <p className="text-green-600 mt-2">{message}</p>}
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
    );
  }

  // status === "success"
  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg text-center">
      <h1 className="text-2xl font-semibold mb-4">Email Verified!</h1>
      <p>Your account is active. You can now log in.</p>
      <Link to="/login" className="inline-block mt-4 text-blue-500 hover:underline">
        Log In
      </Link>
    </div>
  );
}
