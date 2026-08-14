import React, { createContext, useContext, useEffect, useState } from "react";
import { apiLogin, apiRegister, apiRefreshToken } from "../api/storeApi.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "shopease_auth_user";
const TOKENS_KEY = "shopease_auth_tokens";
const USERS_KEY = "shopease_registered_users";

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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

    // Try backend login first
    try {
      const data = await apiLogin({ emailOrUsername: email, password });
      const tokens = {
        access: data.access || data.token || null,
        refresh: data.refresh || null,
      };
      const user = data.user || data.profile || { email, username: email };
      if (tokens.access) {
        persist(user, tokens);
        return { success: true, user };
      }
    } catch (err) {
      // ignore and fallback to local demo
    }

    // Demo admin account
    if (
      email.toLowerCase() === "admin@shopease.com" &&
      password === "admin123"
    ) {
      const adminUser = {
        id: "admin-1",
        name: "Admin User",
        email,
        role: "admin",
      };
      persist(adminUser, null);
      return { success: true, user: adminUser };
    }

    // Local fallback users (demo)
    const users = loadUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!found) {
      setAuthError("Invalid email or password.");
      return { success: false, message: "Invalid email or password." };
    }
    const { password: _pw, ...safeUser } = found;
    persist(safeUser, null);
    return { success: true, user: safeUser };
  };

  const register = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      setAuthError("All fields are required.");
      return { success: false, message: "All fields are required." };
    }
    setAuthError(null);

    const [first_name, ...rest] = name.trim().split(" ");
    const last_name = rest.join(" ");

    // Try backend registration
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
      if (tokens.access) {
        persist(user, tokens);
        return { success: true, user };
      }
    } catch (err) {
      // ignore and fallback to local
    }

    const users = loadUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }
    const newUser = {
      id: `cust-${Date.now()}`,
      name,
      email,
      password,
      role: "customer",
    };
    users.push(newUser);
    saveUsers(users);
    const { password: _pw, ...safeUser } = newUser;
    persist(safeUser, null);
    return { success: true, user: safeUser };
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
