// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

import { createAxiosInstance } from "./api/axiosInstance";
import LoginPage               from "./pages/LoginPage";
import SignupPage              from "./pages/SignupPage";
import VerifyEmailPage         from "./pages/VerifyEmailPage";
import AuthSuccessPage         from "./pages/AuthSuccessPage";
import Dashboard               from "./pages/Dashboard";

// App: main component setting up routes and auth context
export default function App() {
  const { token, logout } = useAuth();
  const axiosInstance    = createAxiosInstance(token, logout);
  const isAuth           = Boolean(token);

  return (
    <Routes>
      {/* root: redirect based on auth */}
      <Route
        path="/"
        element={
          isAuth
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* unified email verification flow */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* OAuth success callback */}
      <Route path="/auth-success" element={<AuthSuccessPage />} />

      {/* protected routes */}
      <Route
        path="/dashboard"
        element={
          isAuth
            ? <Dashboard axios={axiosInstance} />
            : <Navigate to="/login" replace />
        }
      />

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
