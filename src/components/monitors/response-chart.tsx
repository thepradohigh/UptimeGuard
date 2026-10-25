"use client";
import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Check } from "@/types";
import { format } from "date-fns";

export function ResponseChart({ checks, height = 300 }: { checks: Check[]; height?: number }) {
  const data = React.useMemo(() => checks.filter((c) => c.responseTime !== null).map((c) => ({
    time: format(new Date(c.createdAt), "HH:mm"),
    responseTime: c.responseTime,
    status: c.status,
    fullTime: format(new Date(c.createdAt), "dd MMM HH:mm:ss"),
  })), [checks]);

  if (data.length === 0) return <div className="flex items-center justify-center h-[300px] text-muted-foreground">No data available</div>;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium">{payload[0]?.payload?.fullTime}</p>
        <p className="text-muted-foreground">Response: <span className="font-mono font-semibold text-foreground">{payload[0]?.value}ms</span></p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(221.2, 83.2%, 53.3%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(221.2, 83.2%, 53.3%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
        <XAxis dataKey="time" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}ms`} width={60} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="responseTime" stroke="hsl(221.2, 83.2%, 53.3%)" strokeWidth={2} fill="url(#colorResponse)" dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}