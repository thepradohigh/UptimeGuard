"use client";
import { useState, useEffect, useCallback } from "react";
import { MonitorStats, Check, Incident, ApiResponse } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";

export function useMonitorStats(monitorId: string) {
  const [stats, setStats] = useState<MonitorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken } = useAuth();

  const fetchStats = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const res = await fetch(`/api/monitors/${monitorId}/stats`, { headers: { Authorization: `Bearer ${token}` } });
      const data: ApiResponse<MonitorStats> = await res.json();
      if (data.data) setStats(data.data);
    } finally { setIsLoading(false); }
  }, [monitorId, getAccessToken]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  return { stats, isLoading, refetch: fetchStats };
}

export function useMonitorChecks(monitorId: string, period: string = "24h") {
  const [checks, setChecks] = useState<Check[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken } = useAuth();

  const fetchChecks = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const res = await fetch(`/api/monitors/${monitorId}/checks?period=${period}`, { headers: { Authorization: `Bearer ${token}` } });
      const data: ApiResponse<Check[]> = await res.json();
      if (data.data) setChecks(data.data);
    } finally { setIsLoading(false); }
  }, [monitorId, period, getAccessToken]);

  useEffect(() => { fetchChecks(); }, [fetchChecks]);
  return { checks, isLoading, refetch: fetchChecks };
}

export function useMonitorIncidents(monitorId: string) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessToken } = useAuth();

  const fetchIncidents = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const res = await fetch(`/api/monitors/${monitorId}/incidents`, { headers: { Authorization: `Bearer ${token}` } });
      const data: ApiResponse<Incident[]> = await res.json();
      if (data.data) setIncidents(data.data);
    } finally { setIsLoading(false); }
  }, [monitorId, getAccessToken]);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);
  return { incidents, isLoading, refetch: fetchIncidents };
}