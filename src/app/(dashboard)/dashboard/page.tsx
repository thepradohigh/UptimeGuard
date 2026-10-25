'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardData {
  stats: {
    total: number;
    up: number;
    down: number;
    avgLatency: string;
  };
  monitors: Array<{
    id: string;
    name: string;
    url: string;
    status: string;
    latency: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const timer = setInterval(fetchStats, 5000); // Live sync каждые 5 сек
    return () => clearInterval(timer);
  }, []);

  const stats = data?.stats || { total: 0, up: 0, down: 0, avgLatency: '--' };
  const monitors = data?.monitors || [];

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="font-serif-display text-4xl sm:text-5xl text-white tracking-tight">
            Overview
          </h1>
          <p className="text-zinc-400 text-[14px] mt-2">
            Real-time infrastructure health and node state.
          </p>
        </div>
        <Link
          href="/monitors"
          className="h-9 inline-flex items-center justify-center px-4 rounded-md bg-white text-black text-[13px] font-medium hover:bg-zinc-200 transition-colors"
        >
          Add Monitor
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Monitors', value: stats.total, color: 'text-white' },
          { label: 'Systems Up', value: stats.up, color: 'text-[#D4FF4F]' },
          { label: 'Systems Down', value: stats.down, color: 'text-red-500' },
          { label: 'Avg. Latency', value: stats.avgLatency, color: 'text-white' },
        ].map((item, i) => (
          <div key={i} className="border border-white/10 bg-white/[0.02] p-5 rounded-xl">
            <div className="text-[11px] font-mono font-medium uppercase tracking-widest text-zinc-500 mb-3">
              {item.label}
            </div>
            <div className={`text-3xl font-mono font-medium tracking-tight ${item.color}`}>
              {loading ? '--' : item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Active Monitors Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-medium text-white">Active Infrastructure</h3>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#D4FF4F] animate-pulse" />
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
              Live Sync
            </span>
          </div>
        </div>

        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A]">
          <div className="divide-y divide-white/5">
            <div className="flex items-center justify-between px-6 py-3 bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              <span className="w-1/2">Service</span>
              <span className="w-1/4">Status</span>
              <span className="w-1/4 text-right">Latency</span>
            </div>

            {loading ? (
              <div className="px-6 py-8 text-center text-[12px] font-mono text-zinc-500">
                Loading infrastructure...
              </div>
            ) : monitors.length === 0 ? (
              <div className="px-6 py-8 text-center text-[12px] font-mono text-zinc-500">
                No active monitors found.
              </div>
            ) : (
              monitors.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-1/2 flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${m.status === 'UP' ? 'bg-[#D4FF4F]' : 'bg-red-500'}`}
                    />
                    <div className="min-w-0 pr-4">
                      <div className="font-mono text-[13px] text-white truncate">{m.name}</div>
                      <div className="text-[11px] text-zinc-500 truncate">{m.url}</div>
                    </div>
                  </div>
                  <span
                    className={`w-1/4 font-mono text-[11px] uppercase font-bold ${m.status === 'UP' ? 'text-zinc-400' : 'text-red-500'}`}
                  >
                    {m.status === 'UP' ? 'Online' : 'Offline'}
                  </span>
                  <span
                    className={`w-1/4 text-[13px] font-mono text-right ${m.status === 'UP' ? 'text-white' : 'text-zinc-500'}`}
                  >
                    {m.latency}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
