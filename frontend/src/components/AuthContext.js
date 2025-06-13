import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication status from localStorage on app load
  useEffect(() => {
  
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");
    setIsAuthenticated(storedAuth === "true");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  const login = (data) => {
    setUser(data.user);
    localStorage.setItem("token", data.user.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true"); // Persist login state
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("isAuthenticated"); // Clear login state
    localStorage.removeItem("user");
  localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);