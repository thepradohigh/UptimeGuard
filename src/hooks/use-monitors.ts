"use client";
import { useState, useEffect, useCallback } from "react";
import { Monitor, ApiResponse } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { useWebSocket } from "@/components/providers/websocket-provider";

export function useMonitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessToken } = useAuth();
  const { subscribe } = useWebSocket();

  const fetchMonitors = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      setError(null);
      const res = await fetch("/api/monitors", { headers: { Authorization: `Bearer ${token}` } });
      const data: ApiResponse<Monitor[]> = await res.json();
      if (data.data) setMonitors(data.data);
      else setError(data.error || "Failed to fetch");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => { fetchMonitors(); }, [fetchMonitors]);

  useEffect(() => {
    const unsub = subscribe("monitor:update", (data: any) => {
      setMonitors((prev) => prev.map((m) =>
        m.id === data.monitorId ? { ...m, lastStatus: data.status, lastCheckedAt: data.lastCheckedAt } : m
      ));
    });
    return unsub;
  }, [subscribe]);

  const deleteMonitor = useCallback(async (id: string) => {
    const token = getAccessToken();
    if (!token) return;
    await fetch(`/api/monitors/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setMonitors((prev) => prev.filter((m) => m.id !== id));
  }, [getAccessToken]);

  const toggleMonitor = useCallback(async (id: string) => {
    const token = getAccessToken();
    if (!token) return;
    const res = await fetch(`/api/monitors/${id}/toggle`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
    const data: ApiResponse<Monitor> = await res.json();
    if (data.data) setMonitors((prev) => prev.map((m) => m.id === id ? { ...m, isActive: data.data!.isActive } : m));
  }, [getAccessToken]);

  return { monitors, isLoading, error, refetch: fetchMonitors, deleteMonitor, toggleMonitor };
}