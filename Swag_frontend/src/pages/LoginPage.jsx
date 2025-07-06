/*
  src/pages/LoginPage.js
  Renders Google OAuth button and traditional login (username or email + password),
  with inline error messaging on login failure.
*/

import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { googleLogin } from "../api/auth";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Redirect to Google OAuth
  const handleGoogleLogin = () => {
    googleLogin();
  };

  // Submit traditional login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Pass credentials as an object to match context API signature
      await login({ identifier, password });
      // Optionally navigate here if context login does not redirect
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      // Extract user-friendly message from possible response shapes
      let message = "An unexpected error occurred. Please try again.";
      const respData = err.response?.data;
      if (respData?.errors && Array.isArray(respData.errors)) {
        message = respData.errors.map(e => e.msg || JSON.stringify(e)).join(", ");
      } else if (respData?.detail) {
        message = respData.detail;
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded"
      >
        Sign in with Google
      </button>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm uppercase">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Traditional Login Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">
            Username or Email
          </label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded mt-2"
        >
          Sign in
        </button>
      </form>

      {/* link to signup */}
      <p className="text-center mt-4">
        Don’t have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
