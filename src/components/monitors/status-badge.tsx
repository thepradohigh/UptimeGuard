"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MonitorStatus } from "@/types";

export function StatusBadge({ status, animated = true, size = "md" }: { status: MonitorStatus; animated?: boolean; size?: "sm" | "md" | "lg" }) {
  const variant = { UP: "success" as const, DOWN: "destructive" as const, TIMEOUT: "warning" as const, UNKNOWN: "secondary" as const }[status];
  const label = { UP: "Operational", DOWN: "Down", TIMEOUT: "Timeout", UNKNOWN: "Unknown" }[status];
  const dotColor = { UP: "bg-green-500", DOWN: "bg-red-500", TIMEOUT: "bg-yellow-500", UNKNOWN: "bg-gray-400" }[status];
  const sizeClasses = { sm: "text-[10px] px-2 py-0.5", md: "text-xs px-2.5 py-0.5", lg: "text-sm px-3 py-1" }[size];

  return (
    <Badge variant={variant} className={cn("gap-1.5", sizeClasses)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dotColor, animated && (status === "UP" || status === "DOWN") && "animate-pulse")} />
      {label}
    </Badge>
  );
}