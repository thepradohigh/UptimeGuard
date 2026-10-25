"use client";
import React, { useEffect, useState, useCallback } from "react";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { StatusGrid } from "@/components/dashboard/status-grid";
import { RecentIncidents } from "@/components/dashboard/recent-incidents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/auth-provider";
import { useWebSocket } from "@/components/providers/websocket-provider";
import { Monitor, Incident, DashboardStats } from "@/types";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { getAccessToken } = useAuth();
  const { subscribe } = useWebSocket();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const [mRes, iRes] = await Promise.all([
        fetch("/api/monitors", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/incidents?status=active", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const mData = await mRes.json();
      const iData = await iRes.json();
      if (mData.data) setMonitors(mData.data);
      if (iData.data) setIncidents(iData.data);
    } finally { setIsLoading(false); }
  }, [getAccessToken]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const unsub = subscribe("monitor:update", (data: any) => {
      setMonitors((prev) => prev.map((m) => m.id === data.monitorId ? { ...m, lastStatus: data.status, lastCheckedAt: data.lastCheckedAt } : m));
      if (data.statusChanged) {
        const token = getAccessToken();
        if (token) {
          fetch("/api/incidents?status=active", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((d) => { if (d.data) setIncidents(d.data); });
        }
      }
    });
    return unsub;
  }, [subscribe, getAccessToken]);

  const stats: DashboardStats = React.useMemo(() => {
    const up = monitors.filter((m) => m.lastStatus === "UP" && m.isActive).length;
    const down = monitors.filter((m) => (m.lastStatus === "DOWN" || m.lastStatus === "TIMEOUT") && m.isActive).length;
    const uptimes = monitors.map((m) => (m as any).uptime24h ?? 100);
    const overallUptime = uptimes.length > 0 ? Math.round(uptimes.reduce((a: number, b: number) => a + b, 0) / uptimes.length * 100) / 100 : 100;
    const rts = monitors.map((m) => (m as any).avgResponseTime ?? 0).filter((t: number) => t > 0);
    const avgRT = rts.length > 0 ? Math.round(rts.reduce((a: number, b: number) => a + b, 0) / rts.length) : 0;
    return { totalMonitors: monitors.length, monitorsUp: up, monitorsDown: down, overallUptime, activeIncidents: incidents.length, avgResponseTime: avgRT };
  }, [monitors, incidents]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of all your monitored services</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button size="sm" asChild><Link href="/monitors/new"><Plus className="w-4 h-4 mr-2" />Add Monitor</Link></Button>
        </div>
      </div>

      <StatsOverview stats={stats} />

      {monitors.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Service Status</CardTitle></CardHeader>
          <CardContent><StatusGrid monitors={monitors} /></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Active Incidents</CardTitle>
          <Button variant="ghost" size="sm" asChild><Link href="/incidents">View all</Link></Button>
        </CardHeader>
        <CardContent><RecentIncidents incidents={incidents.slice(0, 5)} /></CardContent>
      </Card>
    </div>
  );
}