'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

function BrandLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 12H6.5L9 3L15 21L17.5 12H22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Day {
  date: string;
  uptime: number;
}

interface Monitor {
  id: string;
  name: string;
  url: string;
  status: string;
  uptime: string;
  avgLatency: string;
  days: Day[];
}

export default function StatusPage() {
  const [data, setData] = useState<{
    overall: string;
    monitors: Monitor[];
    updatedAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
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
    fetchStatus();
    const timer = setInterval(fetchStatus, 30000);
    return () => clearInterval(timer);
  }, []);

  const getBarColor = (uptime: number) => {
    if (uptime === -1) return 'bg-zinc-900';
    if (uptime === 100) return 'bg-[#D4FF4F]';
    if (uptime >= 95) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const isAllUp = data?.overall === 'operational';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <BrandLogo className="w-6 h-6" />
            <span className="text-[14px] font-semibold tracking-tight">UptimeGuard Status</span>
          </Link>
          <Link
            href="/login"
            className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Admin Login →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Overall Status Banner */}
        <div
          className={`border rounded-2xl p-8 mb-12 ${isAllUp ? 'border-[#D4FF4F]/20 bg-[#D4FF4F]/5' : 'border-red-500/20 bg-red-500/5'}`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isAllUp ? 'bg-[#D4FF4F]/20' : 'bg-red-500/20'}`}
            >
              <div
                className={`w-4 h-4 rounded-full ${isAllUp ? 'bg-[#D4FF4F]' : 'bg-red-500'} animate-pulse`}
              />
            </div>
            <div>
              <h1 className="font-serif-display text-3xl text-white">
                {loading
                  ? 'Checking systems...'
                  : isAllUp
                    ? 'All Systems Operational'
                    : 'Some Systems Degraded'}
              </h1>
              <p className="text-[13px] text-zinc-400 font-mono mt-1">
                Last updated: {data?.updatedAt ? new Date(data.updatedAt).toUTCString() : '--'}
              </p>
            </div>
          </div>
        </div>

        {/* Monitors List */}
        <div className="space-y-6">
          <h2 className="font-serif-display text-2xl text-white mb-6">Service Status</h2>

          {loading ? (
            <div className="text-center text-zinc-500 py-12 font-mono text-sm">
              Loading infrastructure...
            </div>
          ) : !data?.monitors.length ? (
            <div className="text-center text-zinc-500 py-12 font-mono text-sm">
              No public monitors configured.
            </div>
          ) : (
            data.monitors.map((monitor) => (
              <div
                key={monitor.id}
                className="border border-white/10 rounded-xl bg-white/[0.02] p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div
                        className={`w-2 h-2 rounded-full ${monitor.status === 'UP' ? 'bg-[#D4FF4F]' : 'bg-red-500'}`}
                      />
                      <h3 className="text-[15px] font-semibold text-white">{monitor.name}</h3>
                    </div>
                    <p className="text-[12px] font-mono text-zinc-500 ml-5">{monitor.url}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                      90-day uptime
                    </div>
                    <div className="text-[20px] font-mono text-white tabular-nums">
                      {monitor.uptime}%
                    </div>
                  </div>
                </div>

                {/* 90-day Uptime Grid */}
                <div className="flex items-end gap-[2px] h-10">
                  {monitor.days.map((day, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm hover:opacity-70 transition-opacity cursor-help ${getBarColor(day.uptime)}`}
                      title={`${day.date}: ${day.uptime === -1 ? 'No data' : day.uptime + '% uptime'}`}
                      style={{ minWidth: '2px' }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  <span>90 days ago</span>
                  <span>Avg: {monitor.avgLatency}</span>
                  <span>Today</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[12px] text-zinc-600 font-mono mt-16 pt-8 border-t border-white/5">
          Powered by UptimeGuard · Updates every 30s
        </div>
      </main>
    </div>
  );
}
