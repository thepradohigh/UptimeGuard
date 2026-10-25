"use client";
import React from "react";
import { Incident } from "@/types";
import { formatDuration, getRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function RecentIncidents({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
        <p className="text-sm text-muted-foreground">No recent incidents. Everything is running smoothly!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {incidents.map((inc) => (
        <div key={inc.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-all">
          <div className="mt-0.5">
            {inc.resolvedAt ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm truncate">{inc.monitor?.name || "Unknown"}</span>
              <Badge variant={inc.resolvedAt ? "success" : "destructive"} className="text-[10px]">{inc.resolvedAt ? "Resolved" : "Ongoing"}</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{inc.cause || inc.lastError || "No details"}</p>
            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
              <span>Started {getRelativeTime(inc.startedAt)}</span>
              {inc.duration && <span>Duration: {formatDuration(inc.duration)}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}