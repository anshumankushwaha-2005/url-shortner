import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token exists, try to restore the session.
  useEffect(() => {
    const token = localStorage.getItem("snipify_token");
    if (!token) { setLoading(false); return; }

    authApi
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("snipify_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("snipify_token", res.data.token);
    setUser(res.data.user);
    return true;
  };

  const register = async (name, email, password) => {
    const res = await authApi.register(name, email, password);
    localStorage.setItem("snipify_token", res.data.token);
    setUser(res.data.user);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("snipify_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
