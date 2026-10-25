"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { Monitor } from "@/types";
import { cn, getRelativeTime, formatResponseTime } from "@/lib/utils";
import { ExternalLink, Pause, Play, Trash2, Clock, Activity } from "lucide-react";

export function MonitorCard({ monitor, onToggle, onDelete }: { monitor: Monitor; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <Card className={cn("relative overflow-hidden transition-all group", !monitor.isActive && "opacity-60")}>
      <div className={cn("absolute top-0 left-0 w-1 h-full",
        monitor.lastStatus === "UP" && "bg-green-500",
        monitor.lastStatus === "DOWN" && "bg-red-500",
        monitor.lastStatus === "TIMEOUT" && "bg-yellow-500",
        monitor.lastStatus === "UNKNOWN" && "bg-gray-400"
      )} />
      <CardContent className="p-5 pl-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Link href={`/monitors/${monitor.id}`} className="text-base font-semibold hover:text-primary transition-colors truncate">{monitor.name}</Link>
              <StatusBadge status={monitor.lastStatus as any} size="sm" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{monitor.method}</span>
              <span className="truncate max-w-[300px]">{monitor.url}</span>
              <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><ExternalLink className="w-3.5 h-3.5" /></a>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Every {monitor.interval}m</div>
              {monitor.lastCheckedAt && <div className="flex items-center gap-1"><Activity className="w-3.5 h-3.5" />{getRelativeTime(monitor.lastCheckedAt)}</div>}
              {monitor.uptime24h !== undefined && (
                <span className={cn("font-semibold",
                  monitor.uptime24h >= 99 ? "text-green-600 dark:text-green-400" :
                  monitor.uptime24h >= 95 ? "text-yellow-600 dark:text-yellow-400" :
                  "text-red-600 dark:text-red-400"
                )}>{monitor.uptime24h}% uptime</span>
              )}
              {monitor.avgResponseTime !== undefined && monitor.avgResponseTime > 0 && (
                <span className="font-mono">{formatResponseTime(monitor.avgResponseTime)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggle(monitor.id)}>
              {monitor.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => {
              if (confirm(`Delete monitor "${monitor.name}"?`)) onDelete(monitor.id);
            }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}