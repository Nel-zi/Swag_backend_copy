import React from "react";
import WebLogin from "./components/WebLogin/WebLogin";
import Dashboard from "./components/dashboard/Dashboard";
import { AuthProvider } from './contexts/auth-context';
/*
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import { createAxiosInstance } from "./api/axiosInstance";
import LoginPage from "./test pages/LoginPage";
import AuthSuccessPage from "./test pages/AuthSuccessPage";
import Dashboard from "./test pages/Dashboard";
*/

function App() {
  //const { token, logout } = useAuth();  // get auth state and logout function
  //const axiosInstance = createAxiosInstance(token, logout);  // axios with auth
  //const isAuth = Boolean(token);  // whether user is logged in
  
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );

  /*
return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuth
              ? <Navigate to="/dashboard" replace />  // if auth, redirect
              : <LoginPage />  // else show login
          }
        />
        <Route path="/auth-success" element={<AuthSuccessPage />} />  // OAuth callback
        <Route
          path="/dashboard"
          element={
            isAuth
              ? <Dashboard axios={axiosInstance} />  // protected dashboard
              : <Navigate to="/" replace />  // else back to login
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />  // catch-all
      </Routes>
    </Router>
  );
  */

}

export default App;
