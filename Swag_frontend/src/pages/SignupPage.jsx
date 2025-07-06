/*
  src/pages/SignupPage.jsx
  Renders signup form with username, email, password, and both Google signup & a "Log in" link.
*/

import React, { useState } from "react";                          // ← React import
import { useNavigate, Link } from "react-router-dom";             // ← Link import

import { useAuth } from "../contexts/AuthContext";

import { googleLogin } from "../api/auth";                         // ← Google signup/login

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm]       = useState({ username: "", email: "", password: "" });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup(form);
      // redirect happens inside signup()
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google signup uses same OAuth endpoint as login
  const handleGoogleSignup = () => {
    googleLogin();
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg signup-page">
      <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>

      {/* Google Sign Up */}
      <button
        onClick={handleGoogleSignup}
        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded"
      >
        Sign up with Google
      </button>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm uppercase">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded mt-2"
        >
          {loading ? "Signing up…" : "Sign Up"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
      </form>

      {/* Login link */}
      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
