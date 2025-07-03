/*
  useAuth.js
  A custom React Hook to manage JWT authentication state,
  persist it across reloads, and handle login/logout redirects.
*/

import { useState } from "react";  
// React’s built-in Hook for adding state to function components.

export function useAuth() {
  // token: current JWT string (or null if not signed in)
  // setToken: function to update that piece of state
  // We initialize from localStorage so that if the user reloads the SPA,
  // we “remember” their token and keep them logged in.
  const [token, setToken] = useState(() => {
    // The function form of useState’s initializer runs only once on mount,
    // avoiding repeated localStorage reads on every render.
    return localStorage.getItem("token");
  });

  // saveToken: updates both React state and browser storage.
  // newToken: JWT string received after a successful OAuth flow.
  const saveToken = (newToken) => {
    // 1) Update token in React state so components re-render with auth.
    setToken(newToken);

    // 2) Persist token in localStorage so it survives a full page reload.
    //    localStorage stores simple key/value strings under the “token” key.
    localStorage.setItem("token", newToken);
  };

  // logout: clears auth state & storage, then kicks off Google OAuth again.
  const logout = () => {
    // 1) Clear the token in React state so UI updates immediately (e.g.,
    //    protected routes will redirect to login).
    setToken(null);

    // 2) Remove the token from localStorage so it doesn't linger.
    localStorage.removeItem("token");

    // 3) Build the redirect URI that Google’s OAuth callback should hit after login.
    //    window.location.origin = e.g. "[https://your-spa.com](https://your-spa.com)"
    const redirectUri = window.location.origin + "/auth-success";

    // 4) Construct the full backend OAuth-start URL.
    //    encodeURIComponent ensures the redirectUri is safely included.
    const loginUrl =
      "[https://your-backend.com/auth/google/login?](https://your-backend.com/auth/google/login?)" +
      `redirect_uri=${encodeURIComponent(redirectUri)}`;

    // 5) Navigate the entire browser window to that URL,
    //    triggering a full-page redirect into the OAuth flow.
    window.location.href = loginUrl;
  };

  // Expose the current token and auth helpers to any component that calls useAuth().
  return { token, saveToken, logout };
}