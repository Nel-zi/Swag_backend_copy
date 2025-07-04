/*
  useAuth.js
  A custom React Hook to manage JWT authentication state,
  persist it across reloads, and handle login/logout redirects.
*/


// src/hooks/useAuth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginUser,     // === ADDED
  registerUser,  // === ADDED
  googleLogin,   // existing
} from "../api/auth";

// Read the env var via import.meta.env
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// useAuth: custom hook for handling auth tokens
export function useAuth() {
  const navigate = useNavigate();                    // === ADDED

  // Initialize token state from localStorage to keep user logged in on reload
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // saveToken: stores token in React state and browser storage
  const saveToken = (newToken) => {
    setToken(newToken);                            // Update hook state
    localStorage.setItem("token", newToken);       // Persist in localStorage
  };

  // === ADD LOGIN METHOD ===
  const login = async ({ identifier, password }) => {
    try {
      const { access_token } = await loginUser({ identifier, password });
      saveToken(access_token);
      // optionally: navigate to protected page
      navigate("/dashboard");
    } catch (err) {
      console.error("login failed:", err);
      throw err;
    }
  };

  // === ADD SIGNUP METHOD ===
  const signup = async (userData) => {
    try {
      const res = await registerUser(userData);
      // if your backend returns an access token immediately:
      if (res.access_token) {
        saveToken(res.access_token);
        navigate("/dashboard");
      } else {
        // otherwise send them to login
        navigate("/login");
      }
      return res;
    } catch (err) {
      console.error("signup failed:", err);
      throw err;
    }
  };

  // logout: clears token and sends user to the login page
  const logout = () => {
    setToken(null);                       // Clear state
    localStorage.removeItem("token");     // Remove from storage
    navigate("/login");                   // === UPDATED REDIRECT
  };

  return {
    token,
    saveToken,
    login,     // === EXPOSED
    signup,    // === EXPOSED
    logout,    // === UPDATED
  };
}
