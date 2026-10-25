"use client";
import React from "react";
import { Incident } from "@/types";
import { formatDuration, cn } from "@/lib/utils";
import { format } from "date-fns";

export function IncidentTimeline({ incidents }: { incidents: Incident[] }) {
  if (incidents.length === 0) return null;
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-6">
        {incidents.map((inc) => (
          <div key={inc.id} className="relative flex gap-4 pl-10">
            <div className={cn("absolute left-2.5 w-3 h-3 rounded-full border-2 border-background", inc.resolvedAt ? "bg-green-500" : "bg-red-500")} />
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{inc.resolvedAt ? "Resolved" : "Ongoing"}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(inc.startedAt), "MMM dd, yyyy HH:mm")}</span>
              </div>
              <p className="text-sm text-muted-foreground">{inc.cause || inc.lastError}</p>
              {inc.duration && <p className="text-xs text-muted-foreground mt-1">Downtime: {formatDuration(inc.duration)}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}