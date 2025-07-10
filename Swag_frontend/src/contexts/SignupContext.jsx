// src/contexts/SignupContext.jsx
import React, { createContext, useState } from 'react';

export const SignupContext = createContext(null);

export function SignupProvider({ children }) {
  const [data, setData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    location: null,    // { zip } or { lat, lng, label }
    categories: []     // array of selected categories
  });

  const update = (partial) => {
    setData(d => ({ ...d, ...partial }));
  };

  return (
    <SignupContext.Provider value={{ data, update }}>
      {children}
    </SignupContext.Provider>
  );
}
