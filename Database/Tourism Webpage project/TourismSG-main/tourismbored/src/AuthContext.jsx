// src/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user on first render
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Called on successful login
  const login = (userData) => {
    // Expect userData to contain at least: { user_id, name, email, role: 'user'|'admin' }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Allow profile/settings to update parts of user
  const updateUser = (partial) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...partial };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const isLoggedIn = !!user;
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook shortcut
export const useAuth = () => useContext(AuthContext);
