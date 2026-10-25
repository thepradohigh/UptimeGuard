"use client";
import React from "react";
import Link from "next/link";
import { Monitor } from "@/types";
import { cn, getRelativeTime } from "@/lib/utils";

export function StatusGrid({ monitors }: { monitors: Monitor[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {monitors.map((m) => (
        <Link key={m.id} href={`/monitors/${m.id}`} className={cn(
          "relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:shadow-md group",
          m.lastStatus === "UP" && "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10",
          m.lastStatus === "DOWN" && "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10",
          m.lastStatus === "TIMEOUT" && "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10",
          m.lastStatus === "UNKNOWN" && "border-gray-200 dark:border-gray-700",
          !m.isActive && "opacity-50"
        )}>
          <div className={cn("w-3 h-3 rounded-full mb-3",
            m.lastStatus === "UP" && "bg-green-500 status-pulse-up",
            m.lastStatus === "DOWN" && "bg-red-500 status-pulse-down",
            m.lastStatus === "TIMEOUT" && "bg-yellow-500",
            m.lastStatus === "UNKNOWN" && "bg-gray-400"
          )} />
          <p className="text-sm font-medium text-center truncate w-full">{m.name}</p>
          {m.lastCheckedAt && <p className="text-[10px] text-muted-foreground mt-1">{getRelativeTime(m.lastCheckedAt)}</p>}
        </Link>
      ))}
    </div>
  );
}