"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function UptimeBar({ checks, segments = 45 }: { checks: { status: string; createdAt: string }[]; segments?: number }) {
  const segmentData = React.useMemo(() => {
    if (checks.length === 0) return Array(segments).fill({ status: "UNKNOWN", count: 0 });
    const sorted = [...checks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const start = new Date(sorted[0].createdAt).getTime();
    const end = new Date(sorted[sorted.length - 1].createdAt).getTime();
    const range = end - start || 1;
    const segSize = range / segments;
    return Array.from({ length: segments }, (_, i) => {
      const segStart = start + i * segSize;
      const segEnd = segStart + segSize;
      const segChecks = sorted.filter((c) => { const t = new Date(c.createdAt).getTime(); return t >= segStart && t < segEnd; });
      if (segChecks.length === 0) return { status: "UNKNOWN", count: 0 };
      const downCount = segChecks.filter((c) => c.status === "DOWN" || c.status === "TIMEOUT").length;
      if (downCount > segChecks.length / 2) return { status: "DOWN", count: segChecks.length };
      if (downCount > 0) return { status: "DEGRADED", count: segChecks.length };
      return { status: "UP", count: segChecks.length };
    });
  }, [checks, segments]);

  return (
    <div className="flex gap-[2px] h-8 items-end">
      {segmentData.map((seg, i) => (
        <div
          key={i}
          className={cn(
            "flex-1 rounded-sm min-w-[3px] transition-all hover:opacity-80",
            seg.status === "UP" && "bg-green-500 h-full",
            seg.status === "DOWN" && "bg-red-500 h-full",
            seg.status === "DEGRADED" && "bg-yellow-500 h-full",
            seg.status === "UNKNOWN" && "bg-gray-200 dark:bg-gray-700 h-3"
          )}
          title={`${seg.count} checks - ${seg.status}`}
        />
      ))}
    </div>
  );
}