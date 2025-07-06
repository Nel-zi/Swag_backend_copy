





// // src/contexts/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   loginUser,
//   registerUser,
//   googleLogin,      // if you need Google flow
//   fetchUserProfile, // to pull profile after login
// } from "../api/auth";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const navigate = useNavigate();

//   // === state ===
//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   const [user, setUser]   = useState(null);

//   // === helper to persist token ===
//   const saveToken = (newToken) => {
//     setToken(newToken);
//     localStorage.setItem("token", newToken);
//   };

//   // === fetch profile once we have a token ===
//   useEffect(() => {
//     if (!token) return;
//     (async () => {
//       try {
//         const profile = await fetchUserProfile(token);
//         setUser(profile);
//       } catch (err) {
//         console.error("Invalid token, logging out", err);
//         logout();
//       }
//     })();
//   }, [token]);

//   // === login ===
//   const login = async ({ identifier, password }) => {
//     const { access_token } = await loginUser({ identifier, password });
//     saveToken(access_token);
//     navigate("/dashboard");
//   };

//   // === signup ===
//   const signup = async (userData) => {
//     const res = await registerUser(userData);
//     if (res.access_token) {
//       saveToken(res.access_token);
//       navigate("/dashboard");
//     } else {
//       navigate("/login");
//     }
//     return res;
//   };

//   // === google login (if you had it) ===
//   const loginWithGoogle = async () => {
//     const { access_token } = await googleLogin();
//     saveToken(access_token);
//     navigate("/dashboard");
//   };

//   // === logout ===
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{
//       token,
//       user,
//       login,
//       signup,
//       loginWithGoogle,
//       logout,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // consumer hook — this is all your components import!
// export function useAuth() {
//   return useContext(AuthContext);
// }







// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  googleLogin,      // if you need Google flow
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

  // === signup ===
  const signup = async (userData) => {
    const res = await registerUser(userData);
    if (res.access_token) {
      saveToken(res.access_token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
    return res;
  };

  // === google login (if you had it) ===
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
    <AuthContext.Provider value={{
      token,
      user,
      login,
      signup,
      loginWithGoogle,
      logout,
      saveToken  // ← EXPOSE saveToken to allow raw token setting
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// consumer hook — this is all your components import!
export function useAuth() {
  return useContext(AuthContext);
}
