/*
  src/pages/LoginPage.js
  ---------------------
  Combined multi-step login flow in one file.
  - Route /login/identifier shows identifier form.
  - Route /login/password shows password form (with identifier in state).
*/

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { googleLogin } from '../api/auth';

// Step 1: Identifier form
function IdentifierPage() {
  const [identifier, setIdentifier] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login/password', { state: { identifier } });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
      <button
        onClick={googleLogin}
        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded"
      >
        Sign in with Google
      </button>
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-gray-500 text-sm uppercase">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username or Email</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded"
        >
          Continue
        </button>
      </form>
      <p className="text-center mt-4">
        Don’t have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
      </p>
    </div>
  );
}

// Step 2: Password form
function PasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identifier } = location.state || {};
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    if (!identifier) {
      navigate('/login/identifier');
    }
  }, [identifier, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ identifier, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
      let message = 'An unexpected error occurred. Please try again.';
      const respData = err.response?.data;
      if (respData?.errors && Array.isArray(respData.errors)) {
        message = respData.errors.map(e => e.msg || JSON.stringify(e)).join(', ');
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
      <h2 className="text-2xl font-semibold text-center mb-6">Welcome back, {identifier}</h2>
      {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded"
        >
          Sign In
        </button>
      </form>
      <button
        onClick={() => navigate('/login/identifier')}
        className="mt-4 text-sm text-blue-500 hover:underline"
      >
        Back
      </button>
    </div>
  );
}

// Default to first step when someone imports default or uses legacy LoginPage
export default function LoginPage() {
  return <Navigate to="/login/identifier" replace />;
}

// Named exports for routing
export { IdentifierPage, PasswordPage };
