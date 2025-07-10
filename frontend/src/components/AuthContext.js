import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

// ====== TOGGLE THIS FLAG FOR TEST MODE ======
const TEST_MODE = true; // Set to true for test mode, false for actual mode
// ============================================

export const isTestMode = () => TEST_MODE;

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isTestMode()) {
      setIsAuthenticated(true);
    } else {
      const storedAuth = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(storedAuth === "true");
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    if (!isTestMode()) {
      localStorage.setItem("isAuthenticated", "true");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (!isTestMode()) {
      localStorage.removeItem("isAuthenticated");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);