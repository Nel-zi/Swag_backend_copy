import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api'; // adjust path as needed

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const login = async (identifier, password) => {
    const credentials = identifier.includes('@')
      ? { email: identifier, password }
      : { username: identifier, password };

    const response = await loginUser(identifier, password);

    if (response?.access_token) {
      localStorage.setItem('token', response.access_token);
      setToken(response.access_token);
      navigate('/profile');
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};