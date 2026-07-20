import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("chbd_token");
      if (token) {
        try {
          const me = await getCurrentUser();
          setUser(me);
        } catch {
          localStorage.removeItem("chbd_token");
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem("chbd_token", data.token);
    setUser(data);
    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    localStorage.setItem("chbd_token", data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("chbd_token");
    setUser(null);
  };

  const refreshUser = async () => {
    const me = await getCurrentUser();
    setUser(me);
    return me;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
