/*
  axiosInstance.js
  Creates a pre-configured Axios HTTP client that automatically
  attaches your JWT and handles “Unauthorized” errors globally.
*/

import axios from "axios";  
// Axios is a promise-based HTTP client for the browser (and Node).

export function createAxiosInstance(token, logout) {
  // 1) Create a new Axios instance with your backend’s base URL.
  //    baseURL means every request path will be prefixed with this origin.
  const instance = axios.create({
    baseURL: "[https://swag-backend.onrender.com](https://swag-backend.onrender.com)",
  });

  // 2) Request interceptor: runs before every HTTP request.
  //    We use it to attach the “Authorization: Bearer <token>” header.
  instance.interceptors.request.use((config) => {
    if (token) {
      // If we have a JWT, insert it into the headers so the backend
      // can verify who’s making the request.
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Must return the config for the request to proceed.
    return config;
  });

  // 3) Response interceptor: runs after every response (or error).
  instance.interceptors.response.use(
    // onFulfilled: simply return the successful response so calling code
    //              (e.g. .then(res => …)) continues normally.
    (response) => response,

    // onRejected: inspect errors. If it’s a 401 Unauthorized, our token
    //             is invalid or expired, so we force a logout.
    (error) => {
      if (error.response?.status === 401) {
        // Call the logout function passed in, which will clear state/storage
        // and redirect into the OAuth flow.
        logout();
      }
      // Re-throw the error so downstream code (.catch) can also handle it.
      return Promise.reject(error);
    }
  );

  // Return the fully configured Axios client to the caller.
  return instance;
}