/*
  App.js
  Root of the SPA: sets up routes, ties in auth state,
  and injects our Axios client into protected pages.
*/


// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { createAxiosInstance } from "./api/axiosInstance";
import LoginPage        from "./pages/LoginPage";
import SignupPage       from "./pages/SignupPage";      // ← ADDED
import AuthSuccessPage  from "./pages/AuthSuccessPage";
import Dashboard        from "./pages/Dashboard";

// App: main component setting up routes and auth context
export default function App() {
  const { token, logout } = useAuth();
  const axiosInstance    = createAxiosInstance(token, logout);
  const isAuth           = Boolean(token);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuth
            ? <Navigate to="/dashboard" replace />      // if logged in, go to dashboard else show login
            : <Navigate to="/login" replace />          // ← CHANGED: force explicit /login
        }
      />

      <Route path="/login" element={<LoginPage />} />   {/* ← NEW LOGIN ROUTE */}
      <Route path="/signup" element={<SignupPage />} /> {/* ← NEW SIGNUP ROUTE */}

      <Route path="/auth-success" element={<AuthSuccessPage />} />

      <Route
        path="/dashboard"
        element={
          isAuth
            ? <Dashboard axios={axiosInstance} />
            : <Navigate to="/login" replace />           // ← UPDATED redirect target
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
