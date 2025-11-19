import { createContext, useContext, useState } from "react";
import { setAccessToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);

  const login = (token) => {
    setAccessToken(token);
    setIsAuth(true);
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
