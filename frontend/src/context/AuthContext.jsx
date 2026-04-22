/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe } from "../api/dashboardApi";
import {
  clearAuth as clearStoredAuth,
  getAuthToken,
  getStoredUser,
} from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getAuthToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const saveAuth = (data) => {
    const resolvedToken = data?.token || data?.accessToken || "";

    localStorage.setItem("token", resolvedToken);
    localStorage.setItem("userInfo", JSON.stringify(data));

    setToken(resolvedToken);
    setUser(data);
  };

  const logout = () => {
    clearStoredAuth();
    setToken("");
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = getAuthToken();

      if (!storedToken) {
        setUser(null);
        setToken("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setToken(storedToken);

        const userData = await getMe();

        const existing = getStoredUser() || {};
        const mergedUser = { ...existing, ...userData };

        localStorage.setItem("userInfo", JSON.stringify(mergedUser));
        setUser(mergedUser);
      } catch (error) {
        console.error("Failed to load user", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      saveAuth,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
