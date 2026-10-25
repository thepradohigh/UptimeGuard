'use client';

import { useEffect, useState } from 'react';

interface Incident {
  id: string;
  status: string;
  cause: string | null;
  startedAt: string;
  resolvedAt: string | null;
  monitor: {
    name: string;
    url: string;
  };
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIncidents = async () => {
    try {
      const res = await fetch('/api/incidents');
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-serif-display text-4xl text-white tracking-tight">Incident Log</h1>
        <p className="text-zinc-400 text-[14px] mt-2">
          Chronological history of all automated checks and alerts.
        </p>
      </div>

      <div className="border border-white/10 rounded-xl bg-[#0A0A0A] p-8 md:p-12">
        {loading ? (
          <div className="text-center font-mono text-xs text-zinc-500">
            Loading incident history...
          </div>
        ) : incidents.length === 0 ? (
          <div className="text-center font-mono text-xs text-zinc-500">
            No incidents recorded yet. All systems operational.
          </div>
        ) : (
          <div className="relative pl-6 space-y-10 border-l border-white/10">
            {incidents.map((ev) => (
              <div key={ev.id} className="relative group">
                <div
                  className={`absolute -left-[30px] top-1 h-3 w-3 rounded-full border-[3px] bg-black ${ev.status === 'ACTIVE' ? 'bg-red-500 border-red-500/30' : 'bg-zinc-300 border-white/30'}`}
                />

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`font-mono text-[11px] uppercase tracking-widest ${ev.status === 'ACTIVE' ? 'text-red-500 font-bold' : 'text-zinc-500'}`}
                      >
                        {ev.status === 'ACTIVE' ? 'Ongoing Incident' : 'Resolved'}
                      </span>
                      <span className="text-[12px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded font-mono">
                        {ev.monitor.name}
                      </span>
                    </div>
                    <p className="text-[14px] text-zinc-200 leading-relaxed">
                      {ev.cause || 'Service unreachable'}
                    </p>
                  </div>
                  <div className="font-mono text-[12px] text-zinc-500 shrink-0">
                    {new Date(ev.startedAt).toISOString().replace('T', ' ').substring(0, 19)} UTC
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
