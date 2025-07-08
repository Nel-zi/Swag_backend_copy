// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";
import { createAxiosInstance } from "./api/axiosInstance";

import LoginPage, {
  IdentifierPage,
  PasswordPage,
  ForgotPasswordPage,
  ResetPasswordPage
} from "./pages/LoginPage";

import SignupPage      from "./pages/SignupPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import AuthSuccessPage from "./pages/AuthSuccessPage";
import Dashboard       from "./pages/Dashboard";

export default function App() {
  const { token, logout } = useAuth();
  const axiosInstance    = createAxiosInstance(token, logout);
  const isAuth           = Boolean(token);

  return (
    <Routes>
      {/* Root: send users to dashboard if signed in, otherwise straight into 2‑step login */}
      <Route
        path="/"
        element={
          isAuth
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* Two‑step login flow */}
      <Route
        path="/login"
        element={<Navigate to="/login/identifier" replace />}
      />
      <Route path="/login/identifier" element={<IdentifierPage />} />
      <Route path="/login/password"   element={<PasswordPage />} />

      {/* Forgot & Reset Password */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* Signup & email flows */}
      <Route path="/signup"         element={<SignupPage />} />
      <Route path="/verify-email"   element={<VerifyEmailPage />} />
      <Route path="/auth-success"   element={<AuthSuccessPage />} />

      {/* Protected Dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuth
            ? <Dashboard axios={axiosInstance} />
            : <Navigate to="/login" replace />
        }
      />

      {/* catch‑all back home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
