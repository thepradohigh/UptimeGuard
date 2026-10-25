'use client';

import {
  AlertTriangle,
  Clock,
  ExternalLink,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Monitor {
  id: string;
  name: string;
  url: string;
  method: string;
  interval: number;
  status: 'UP' | 'DOWN' | 'PAUSED';
  createdAt: string;
}

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [interval, setIntervalVal] = useState(60);
  const [creating, setCreating] = useState(false);

  // Edit Modal
  const [editingMonitor, setEditingMonitor] = useState<Monitor | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMonitors = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch('/api/monitors');
      if (res.ok) {
        const data = await res.json();
        setMonitors(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Ошибка загрузки мониторов', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitors();
    const timer = setInterval(() => fetchMonitors(), 5000);
    return () => clearInterval(timer);
  }, [fetchMonitors]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/monitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, method, interval }),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        setName('');
        setUrl('');
        setMethod('GET');
        setIntervalVal(60);
        fetchMonitors();
      } else {
        const err = await res.json();
        alert(err.error || 'Ошибка создания монитора');
      }
    } catch (err) {
      alert('Не удалось создать монитор');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/monitors/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        fetchMonitors();
      }
    } catch (err) {
      console.error('Ошибка тогла', err);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMonitor) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/monitors/${editingMonitor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingMonitor.name,
          url: editingMonitor.url,
          method: editingMonitor.method,
          interval: editingMonitor.interval,
        }),
      });

      if (res.ok) {
        setEditingMonitor(null);
        fetchMonitors();
      } else {
        const err = await res.json();
        alert(err.error || 'Ошибка сохранения');
      }
    } catch (err) {
      alert('Не удалось сохранить изменения');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/monitors/${deletingId}`, { method: 'DELETE' });
      if (res.ok) {
        setDeletingId(null);
        fetchMonitors();
      } else {
        alert('Ошибка удаления');
      }
    } catch (err) {
      alert('Не удалось удалить монитор');
    } finally {
      setDeleting(false);
    }
  };

  const filteredMonitors = monitors.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.url.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Управление мониторами</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Отслеживание работоспособности вашим HTTP/HTTPS эндпоинтов
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchMonitors(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Обновить"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#D4FF4F]' : ''}`} />
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition shadow-lg"
          >
            <Plus className="w-4 h-4" /> Добавить монитор
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/40 border border-white/10 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Поиск по названию или URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4FF4F]"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 w-full sm:w-auto justify-end">
          <span>
            Всего: <strong className="text-white">{monitors.length}</strong>
          </span>
          <span>•</span>
          <span>
            Активные:{' '}
            <strong className="text-[#D4FF4F]">
              {monitors.filter((m) => m.status === 'UP').length}
            </strong>
          </span>
          <span>•</span>
          <span>
            Сбои:{' '}
            <strong className="text-red-400">
              {monitors.filter((m) => m.status === 'DOWN').length}
            </strong>
          </span>
        </div>
      </div>

      {/* Monitors List */}
      {loading && monitors.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-sm font-mono text-zinc-400">
          <RefreshCw className="w-6 h-6 text-[#D4FF4F] animate-spin mr-3" />
          Загрузка списка мониторов...
        </div>
      ) : filteredMonitors.length === 0 ? (
        <div className="p-12 text-center bg-zinc-900/40 border border-dashed border-white/10 rounded-2xl space-y-3">
          <Clock className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">Мониторы не найдены</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {searchQuery
              ? 'По вашему запросу ничего не найдено.'
              : 'Добавьте ваш первый сервис для отслеживания доступности.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredMonitors.map((m) => {
            if (!m || !m.id) return null;

            return (
              <div
                key={m.id}
                className="group relative bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
                          m.status === 'UP'
                            ? 'bg-[#D4FF4F]/10 border-[#D4FF4F]/30 text-[#D4FF4F]'
                            : m.status === 'DOWN'
                              ? 'bg-red-500/10 border-red-500/30 text-red-400'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            m.status === 'UP'
                              ? 'bg-[#D4FF4F] animate-pulse'
                              : m.status === 'DOWN'
                                ? 'bg-red-500 animate-pulse'
                                : 'bg-zinc-500'
                          }`}
                        />
                        {m.status}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-white/5 uppercase">
                        {m.method}
                      </span>

                      <span className="text-xs font-mono text-zinc-500">
                        интервал {m.interval}s
                      </span>
                    </div>

                    <Link
                      href={`/monitors/${m.id}`}
                      prefetch={false}
                      className="inline-block text-base font-bold text-white hover:text-[#D4FF4F] transition"
                    >
                      {m.name}
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-zinc-400 hover:text-white transition inline-flex items-center gap-1"
                      >
                        {m.url}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/5 justify-between md:justify-end">
                    <Link
                      href={`/monitors/${m.id}`}
                      prefetch={false}
                      className="px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                    >
                      Детали →
                    </Link>

                    <button
                      onClick={(e) => handleToggle(e, m.id)}
                      className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      title={m.status === 'PAUSED' ? 'Возобновить' : 'Поставить на паузу'}
                    >
                      {m.status === 'PAUSED' ? (
                        <Play className="w-4 h-4 text-[#D4FF4F] fill-current" />
                      ) : (
                        <Pause className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingMonitor(m);
                      }}
                      className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      title="Редактировать"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setDeletingId(m.id);
                      }}
                      className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Новый монитор</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">Название сервиса</label>
                <input
                  type="text"
                  required
                  placeholder="My Production API"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">URL эндпоинта</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.example.com/health"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">HTTP Метод</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="HEAD">HEAD</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Интервал проверки</label>
                  <select
                    value={interval}
                    onChange={(e) => setIntervalVal(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                  >
                    <option value={10}>10 секунд</option>
                    <option value={30}>30 секунд</option>
                    <option value={60}>60 секунд (1 мин)</option>
                    <option value={300}>300 секунд (5 мин)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {creating ? 'Создание...' : 'Создать монитор'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMonitor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Редактировать монитор</h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">Название сервиса</label>
                <input
                  type="text"
                  required
                  value={editingMonitor.name}
                  onChange={(e) => setEditingMonitor({ ...editingMonitor, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">URL эндпоинта</label>
                <input
                  type="url"
                  required
                  value={editingMonitor.url}
                  onChange={(e) => setEditingMonitor({ ...editingMonitor, url: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">HTTP Метод</label>
                  <select
                    value={editingMonitor.method}
                    onChange={(e) =>
                      setEditingMonitor({ ...editingMonitor, method: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="HEAD">HEAD</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Интервал проверки</label>
                  <select
                    value={editingMonitor.interval}
                    onChange={(e) =>
                      setEditingMonitor({ ...editingMonitor, interval: Number(e.target.value) })
                    }
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                  >
                    <option value={10}>10 секунд</option>
                    <option value={30}>30 секунд</option>
                    <option value={60}>60 секунд (1 мин)</option>
                    <option value={300}>300 секунд (5 мин)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMonitor(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition disabled:opacity-50"
                >
                  {savingEdit ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-500/20 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white">Удалить этот монитор?</h2>
              <p className="text-xs text-zinc-400">
                Все собранные пинги и история инцидентов будут безвозвратно удалены.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
