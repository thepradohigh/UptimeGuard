"use client";
import React from "react";
import { MonitorCard } from "./monitor-card";
import { Monitor } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function MonitorList({ monitors, isLoading, onToggle, onDelete }: { monitors: Monitor[]; isLoading: boolean; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    );
  }

  if (monitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No monitors yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm">Add your first monitor to start tracking the uptime and performance of your websites and APIs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {monitors.map((m) => <MonitorCard key={m.id} monitor={m} onToggle={onToggle} onDelete={onDelete} />)}
    </div>
  );
}