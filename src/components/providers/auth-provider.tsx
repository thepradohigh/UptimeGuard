"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, AuthTokens } from "@/types";

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function apiCall(url: string, options: RequestInit = {}) {
  const res = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("uptimeguard_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTokens(parsed.tokens);
        setUser(parsed.user);
      } catch {
        localStorage.removeItem("uptimeguard_auth");
      }
    }
    setIsLoading(false);
  }, []);

  const persist = useCallback((u: User, t: AuthTokens) => {
    localStorage.setItem("uptimeguard_auth", JSON.stringify({ user: u, tokens: t }));
    document.cookie = `accessToken=${t.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiCall("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    const { user, accessToken, refreshToken } = result.data;
    const newTokens = { accessToken, refreshToken };
    setUser(user); setTokens(newTokens); persist(user, newTokens);
  }, [persist]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const result = await apiCall("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password, name }) });
    const { user, accessToken, refreshToken } = result.data;
    const newTokens = { accessToken, refreshToken };
    setUser(user); setTokens(newTokens); persist(user, newTokens);
  }, [persist]);

  const logout = useCallback(() => {
    setUser(null); setTokens(null);
    localStorage.removeItem("uptimeguard_auth");
    document.cookie = "accessToken=; path=/; max-age=0";
    window.location.href = "/login";
  }, []);

  const updateUser = useCallback((u: User) => {
    setUser(u);
    if (tokens) persist(u, tokens);
  }, [tokens, persist]);

  const getAccessToken = useCallback(() => tokens?.accessToken || null, [tokens]);

  useEffect(() => {
    if (!tokens?.refreshToken) return;
    const interval = setInterval(async () => {
      try {
        const result = await apiCall("/api/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken: tokens.refreshToken }) });
        const newTokens = { accessToken: result.data.accessToken, refreshToken: result.data.refreshToken };
        setTokens(newTokens);
        if (user) persist(user, newTokens);
      } catch { logout(); }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tokens?.refreshToken, user, persist, logout]);

  return (
    <AuthContext.Provider value={{ user, tokens, isLoading, isAuthenticated: !!user && !!tokens, login, register, logout, updateUser, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}