"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Monitor, Activity, AlertTriangle, Clock } from "lucide-react";
import { DashboardStats } from "@/types";

export function StatsOverview({ stats }: { stats: DashboardStats }) {
  const cards = [
    { title: "Total Monitors", value: stats.totalMonitors, subtitle: `${stats.monitorsUp} up, ${stats.monitorsDown} down`, icon: Monitor, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Overall Uptime", value: `${stats.overallUptime}%`, subtitle: "Last 24 hours", icon: Activity,
      color: stats.overallUptime >= 99 ? "text-green-500" : stats.overallUptime >= 95 ? "text-yellow-500" : "text-red-500",
      bg: stats.overallUptime >= 99 ? "bg-green-500/10" : stats.overallUptime >= 95 ? "bg-yellow-500/10" : "bg-red-500/10" },
    { title: "Active Incidents", value: stats.activeIncidents, subtitle: stats.activeIncidents > 0 ? "Requires attention" : "All clear", icon: AlertTriangle,
      color: stats.activeIncidents > 0 ? "text-red-500" : "text-green-500",
      bg: stats.activeIncidents > 0 ? "bg-red-500/10" : "bg-green-500/10" },
    { title: "Avg Response", value: `${stats.avgResponseTime}ms`, subtitle: "Across all monitors", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
              </div>
              <div className={cn("p-2.5 rounded-xl", card.bg)}>
                <card.icon className={cn("w-5 h-5", card.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}