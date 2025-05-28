import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const EXPIRATION_TIME = 1000 * 60 *60  // 1 hour in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return null;

    try {
      const record = JSON.parse(stored);
      // Check if expired
      if (new Date().getTime() > record.expiry) {
        localStorage.removeItem("user");
        return null;
      }
      return record.data;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (userData) => {
    const record = {
      data: userData,
      expiry: new Date().getTime() + EXPIRATION_TIME,
    };
    localStorage.setItem("user", JSON.stringify(record));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
