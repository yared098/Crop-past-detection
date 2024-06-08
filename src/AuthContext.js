import React, { createContext, useState, useContext } from 'react';

// Create a context with a default value
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if the user is authenticated (this could be checking a token in localStorage, etc.)
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = () => {
    // Set the user as authenticated
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Set the user as unauthenticated
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
