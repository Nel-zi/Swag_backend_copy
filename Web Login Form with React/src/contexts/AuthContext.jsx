import React from "react";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { registerUser } from "../api";
import { fetchUserProfile } from "../api";

///// Creates an authentication token

const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem(token));
    const [user, setUser] = useState(null);
    const navigate = useNavigate;

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                const user = await fetchUserProfile('token');
                setUser(user);
            };
            getUser();
        }
    }, [token]);

    const login = async (identifier, password) => {
        // 1️⃣ Build the right payload
        const credentials = identifier.includes('@')
            ? { email: identifier, password }
            : { username: identifier, password };

        // 2️⃣ Send to /auth/token
        const response = await loginUser(credentials);
  
        // 3️⃣ On success, stash the token & redirect
        if (response?.access_token) {
            localStorage.setItem('token', response.access_token);
            setToken(response.access_token);
            navigate('/profile');
        }
    };

    const register = async (username, email, password) => {
        await registerUser({ username, email, password });
        navigate('/login');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};



export {AuthProvider, AuthContext}
