"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncidentList } from "@/components/incidents/incident-list";
import { useAuth } from "@/components/providers/auth-provider";
import { Incident } from "@/types";

export default function IncidentsPage() {
  const { getAccessToken } = useAuth();
  const [active, setActive] = useState<Incident[]>([]);
  const [resolved, setResolved] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIncidents = useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const [aRes, rRes] = await Promise.all([
        fetch("/api/incidents?status=active", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/incidents?status=resolved", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const aData = await aRes.json();
      const rData = await rRes.json();
      if (aData.data) setActive(aData.data);
      if (rData.data) setResolved(rData.data);
    } finally { setIsLoading(false); }
  }, [getAccessToken]);

  useEffect(() => { fetchIncidents(); }, [fetchIncidents]);

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incidents</h1>
        <p className="text-muted-foreground text-sm mt-1">Track and review all service disruptions</p>
      </div>
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="active"><IncidentList incidents={active} isLoading={isLoading} /></TabsContent>
        <TabsContent value="resolved"><IncidentList incidents={resolved} isLoading={isLoading} /></TabsContent>
      </Tabs>
    </div>
  );
}