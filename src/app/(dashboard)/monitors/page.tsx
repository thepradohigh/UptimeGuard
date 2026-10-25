'use client';

import { PauseIcon, Pencil2Icon, PlayIcon, TrashIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

interface Monitor {
  id: string;
  name: string;
  url: string;
  method: string;
  interval: number;
  status: string;
  latency: string;
}

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);

  // Состояния модалки добавления/редактирования
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Поля формы
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [interval, setIntervalVal] = useState('30');
  const [submitting, setSubmitting] = useState(false);

  // Состояние модалки удаления
  const [monitorToDelete, setMonitorToDelete] = useState<Monitor | null>(null);

  const fetchMonitors = async () => {
    try {
      const res = await fetch('/api/monitors');
      if (res.ok) {
        const data = await res.json();
        setMonitors(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
    const timer = setInterval(fetchMonitors, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setUrl('');
    setMethod('GET');
    setIntervalVal('30');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (monitor: Monitor) => {
    setEditingId(monitor.id);
    setName(monitor.name);
    setUrl(monitor.url);
    setMethod(monitor.method);
    setIntervalVal(monitor.interval.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    setSubmitting(true);
    try {
      const urlPath = editingId ? `/api/monitors/${editingId}` : '/api/monitors';
      const fetchMethod = editingId ? 'PATCH' : 'POST';

      const res = await fetch(urlPath, {
        method: fetchMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, method, interval: Number(interval) }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchMonitors();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePause = async (id: string) => {
    try {
      const res = await fetch(`/api/monitors/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        fetchMonitors();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (!monitorToDelete) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/monitors/${monitorToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setMonitorToDelete(null);
        fetchMonitors();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="font-serif-display text-4xl text-white tracking-tight">Monitors</h1>
          <p className="text-zinc-400 text-[14px] mt-2">
            Manage your endpoints and polling intervals.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="h-9 inline-flex items-center justify-center px-4 rounded-md bg-white text-black text-[13px] font-medium hover:bg-zinc-200 transition-colors"
        >
          Add Monitor
        </button>
      </div>

      {/* Monitors Table */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A]">
        <div className="divide-y divide-white/5">
          <div className="flex items-center px-6 py-3 bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            <div className="flex-1">Target</div>
            <div className="w-24">Type</div>
            <div className="w-24">Interval</div>
            <div className="w-24">Status</div>
            <div className="w-20 text-right">Latency</div>
            <div className="w-24 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-mono">
              Loading targets...
            </div>
          ) : monitors.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-mono">
              No monitors configured. Click "Add Monitor" to deploy one.
            </div>
          ) : (
            monitors.map((m) => (
              <div
                key={m.id}
                className="flex items-center px-6 py-4 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex-1 flex items-center gap-3">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      m.status === 'UP'
                        ? 'bg-zinc-300'
                        : m.status === 'PAUSED'
                          ? 'bg-zinc-600'
                          : 'bg-red-500'
                    }`}
                  />
                  <div className="min-w-0 pr-4">
                    <div className="font-medium text-[14px] text-white truncate">{m.name}</div>
                    <div className="text-[12px] text-zinc-500 font-mono mt-0.5 truncate">
                      {m.url}
                    </div>
                  </div>
                </div>
                <div className="w-24 text-[12px] font-mono text-zinc-400">{m.method}</div>
                <div className="w-24 text-[12px] font-mono text-zinc-400">{m.interval}s</div>
                <div className="w-24">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-mono font-medium uppercase ${
                      m.status === 'UP'
                        ? 'bg-zinc-800 text-zinc-300'
                        : m.status === 'PAUSED'
                          ? 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                          : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <div
                  className={`w-20 text-right text-[13px] font-mono ${m.status === 'UP' ? 'text-white' : 'text-zinc-500'}`}
                >
                  {m.status === 'PAUSED' ? '--' : m.latency}
                </div>
                <div className="w-24 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTogglePause(m.id)}
                    title={m.status === 'PAUSED' ? 'Resume check' : 'Pause check'}
                    className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    {m.status === 'PAUSED' ? (
                      <PlayIcon className="w-4 h-4 text-[#D4FF4F]" />
                    ) : (
                      <PauseIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(m)}
                    title="Edit monitor"
                    className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Pencil2Icon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMonitorToDelete(m)}
                    title="Delete monitor"
                    className="p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-[16px] font-medium text-white">
                {editingId ? 'Edit Monitor' : 'Create New Monitor'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Monitor Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production API"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 bg-black border border-white/10 rounded-lg px-4 text-[13px] text-white focus:border-white/30 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://api.example.com/health"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full h-10 bg-black border border-white/10 rounded-lg px-4 text-[13px] font-mono text-white focus:border-white/30 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                    Check Interval
                  </label>
                  <select
                    value={interval}
                    onChange={(e) => setIntervalVal(e.target.value)}
                    className="w-full h-10 bg-black border border-white/10 rounded-lg px-4 text-[13px] text-white focus:border-white/30 outline-none"
                  >
                    <option value="10">10 seconds</option>
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                    Method
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full h-10 bg-black border border-white/10 rounded-lg px-4 text-[13px] text-white focus:border-white/30 outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="HEAD">HEAD</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-[13px] font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-white text-black rounded-md text-[13px] font-medium hover:bg-zinc-200"
              >
                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Deploy Monitor'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {monitorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-[18px] font-medium text-white mb-2">Delete Monitor</h3>
              <p className="text-[14px] text-zinc-400">
                Are you sure you want to delete{' '}
                <strong className="text-white">{monitorToDelete.name}</strong>? This action will
                remove all associated pings and incident logs.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMonitorToDelete(null)}
                className="px-4 py-2 text-[13px] font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-[13px] font-medium hover:bg-red-600"
              >
                {submitting ? 'Deleting...' : 'Delete Monitor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
