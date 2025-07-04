// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, fetchUserProfile } from "../api/auth"; 

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    async function loadUser() {
      try {
        const profile = await fetchUserProfile(token);
        setUser(profile);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }

    loadUser();
  }, [token, navigate]);

  // Login with identifier (email or username) and password
  const login = async (identifier, password) => {
    const response = await loginUser({ identifier, password });
    if (response?.access_token) {
      localStorage.setItem("token", response.access_token);
      setToken(response.access_token);
      navigate("/profile");
    } else {
      throw new Error("Login failed");
    }
  };

  // Register user
  const register = async (userData) => {
    // userData should include { username, email, password }
    await registerUser(userData);
    navigate("/login");
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for accessing auth context
export function useAuth() {
  return useContext(AuthContext);
}
