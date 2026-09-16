import React, { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiRegister, apiRefreshToken } from "../api/storeApi.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "shopease_auth_user";
const TOKENS_KEY = "shopease_auth_tokens";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(() => {
    try {
      const raw = localStorage.getItem(TOKENS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // schedule refetch timer id
  const [refreshTimer, setRefreshTimer] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    }
    setLoading(false);
  }, []);

  const persist = (nextUser, tokens) => {
    setUser(nextUser);
    if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(STORAGE_KEY);
    if (tokens) {
      localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
      setTokens(tokens);
    } else if (!nextUser) {
      localStorage.removeItem(TOKENS_KEY);
      setTokens(null);
    }
  };

  function parseJwt(token) {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const decoded = atob(payload.replace(/=+$/, ""));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  async function refreshTokens() {
    try {
      if (!tokens?.refresh) throw new Error("no refresh token");
      const data = await apiRefreshToken({ refresh: tokens.refresh });
      const newTokens = {
        access: data.access || data.token || null,
        refresh: data.refresh || tokens.refresh,
      };
      // persist new tokens (keep user)
      persist(user, newTokens);
      return newTokens;
    } catch (err) {
      // failed to refresh -> logout
      persist(null, null);
      return null;
    }
  }

  // schedule automatic refresh based on token exp
  useEffect(() => {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      setRefreshTimer(null);
    }

    if (!tokens?.access) return;
    const payload = parseJwt(tokens.access);
    const exp = payload?.exp ? payload.exp * 1000 : null;
    if (!exp) return;

    const now = Date.now();
    // refresh 60 seconds before expiry, or immediately if expired
    const refreshAt = Math.max(now + 1000, exp - 60 * 1000);
    const wait = Math.max(0, refreshAt - now);
    const id = setTimeout(() => {
      refreshTokens().catch(() => {});
    }, wait);
    setRefreshTimer(id);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens]);

  const login = async ({ email, password }) => {
    if (!email || !password)
      return { success: false, message: "Email and password are required." };
    setAuthError(null);

    try {
      const data = await apiLogin({ emailOrUsername: email, password });
      const tokens = {
        access: data.access || data.token || null,
        refresh: data.refresh || null,
      };
      const user = data.user || data.profile || { email, username: email };
      if (!tokens.access) {
        setAuthError("Invalid email or password.");
        return { success: false, message: "Invalid email or password." };
      }
      persist(user, tokens);
      return { success: true, user };
    } catch (err) {
      const message = err?.message || "Invalid email or password.";
      setAuthError(message);
      return { success: false, message };
    }
  };

  const register = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      setAuthError("All fields are required.");
      return { success: false, message: "All fields are required." };
    }
    setAuthError(null);

    const [first_name, ...rest] = name.trim().split(" ");
    const last_name = rest.join(" ");

    try {
      const data = await apiRegister({
        username: email,
        email,
        password,
        confirm_password: password,
        first_name,
        last_name,
      });
      const tokens = {
        access: data.access || data.token || null,
        refresh: data.refresh || null,
      };
      const user = data.user ||
        data.profile || { name, email, username: email };
      if (!tokens.access) {
        return {
          success: false,
          message: "Registration failed. Please try again.",
        };
      }
      persist(user, tokens);
      return { success: true, user };
    } catch (err) {
      const message = err?.message || "Registration failed. Please try again.";
      setAuthError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    persist(null, null);
  };

  const value = {
    user,
    loading,
    authError,
    tokens,
    get accessToken() {
      return tokens?.access || null;
    },
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
