/*
  axiosInstance.js
  Creates a pre-configured Axios HTTP client that automatically
  attaches the JWT and handles “Unauthorized” errors globally.
*/

// src/api/axiosInstance.jsx
import axios from "axios";

// Read the env var via import.meta.env
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function createAxiosInstance(token, logout) {
  // Create client using the Vite env var
  const instance = axios.create({ baseURL: API_BASE });


  // request interceptor: add Authorization header if token available
  instance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Set Bearer token
    }
    return config;  // Continue with request
  });

  // response interceptor: log out user on 401 Unauthorized
  instance.interceptors.response.use(
    (response) => response,  // Pass through successful response
    (error) => {
      if (error.response?.status === 401) {  // If unauthorized
        logout();                             // Force re-login
      }
      return Promise.reject(error);  // Propagate error
    }
  );

  return instance;  // Return configured client
}


