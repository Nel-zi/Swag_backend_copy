// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  verifyEmail as apiVerifyEmail,
  googleLogin,      
  fetchUserProfile, // to pull profile after login
} from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // === state ===
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser]   = useState(null);

  // === helper to persist token ===
  const saveToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // === fetch profile once we have a token ===
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const profile = await fetchUserProfile(token);
        setUser(profile);
      } catch (err) {
        console.error("Invalid token, logging out", err);
        logout();
      }
    })();
  }, [token]);

  // === login ===
  const login = async ({ identifier, password }) => {
    const { access_token } = await loginUser({ identifier, password });
    saveToken(access_token);
    navigate("/dashboard");
  };

  // === signup (register) ===
  // now requires email verification before full login
  const signup = async (userData) => {
    const res = await registerUser(userData);
    // backend returns { pending: true, message: "Verification email sent" }
    // redirect user to a "check your email" page
    navigate("/check-your-email", {
      state: { message: res.message || "Check your email to verify your account." },
    });
    return res;
  };

  // === verify email token ===
  const verifyEmail = async (token) => {
    const { access_token, user: verifiedUser } = await apiVerifyEmail(token);
    saveToken(access_token);
    setUser(verifiedUser);
    navigate("/dashboard");
  };

  // === google login ===
  const loginWithGoogle = async () => {
    const { access_token } = await googleLogin();
    saveToken(access_token);
    navigate("/dashboard");
  };

  // === logout ===
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        signup,
        verifyEmail,
        loginWithGoogle,
        logout,
        saveToken,  // ← EXPOSE saveToken to allow raw token setting
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// consumer hook
export function useAuth() {
  return useContext(AuthContext);
}
