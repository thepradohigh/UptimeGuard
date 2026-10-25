"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MonitorList } from "@/components/monitors/monitor-list";
import { useMonitors } from "@/hooks/use-monitors";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MonitorsPage() {
  const { monitors, isLoading, toggleMonitor, deleteMonitor } = useMonitors();
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search.trim()) return monitors;
    const q = search.toLowerCase();
    return monitors.filter((m) => m.name.toLowerCase().includes(q) || m.url.toLowerCase().includes(q));
  }, [monitors, search]);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monitors</h1>
          <p className="text-muted-foreground text-sm mt-1">{monitors.length} monitor{monitors.length !== 1 ? "s" : ""} configured</p>
        </div>
        <Button asChild><Link href="/monitors/new"><Plus className="w-4 h-4 mr-2" />Add Monitor</Link></Button>
      </div>

      {monitors.length > 3 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search monitors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      )}

      <MonitorList monitors={filtered} isLoading={isLoading} onToggle={toggleMonitor} onDelete={deleteMonitor} />
    </div>
  );
}