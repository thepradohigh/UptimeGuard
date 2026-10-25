'use client';

import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Pause,
  Pencil,
  Play,
  RefreshCw,
  Server,
  Trash2,
  XCircle,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface Ping {
  id: string;
  responseTime: number;
  statusCode: number | null;
  isUp: boolean;
  createdAt: string;
}

interface Incident {
  id: string;
  status: 'ACTIVE' | 'RESOLVED';
  cause: string | null;
  startedAt: string;
  resolvedAt: string | null;
}

interface MonitorDetail {
  id: string;
  name: string;
  url: string;
  method: string;
  interval: number;
  status: 'UP' | 'DOWN' | 'PAUSED';
  createdAt: string;
}

interface MonitorStats {
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  totalChecks: number;
  uptimePercent: string;
}

interface PageData {
  monitor: MonitorDetail;
  stats: MonitorStats;
  pings: Ping[];
  incidents: Incident[];
}

export default function MonitorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Принимаем id напрямую из props страницы Next.js
  const rawId = params?.id;
  const monitorId = typeof rawId === 'string' && rawId !== 'undefined' ? rawId : null;

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const [editMethod, setEditMethod] = useState('GET');
  const [editInterval, setEditInterval] = useState(60);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Hovered Ping on Chart
  const [hoveredPing, setHoveredPing] = useState<Ping | null>(null);

  const fetchMonitorData = useCallback(
    async (showRefreshing = false) => {
      if (!monitorId) return;

      if (showRefreshing) setRefreshing(true);
      try {
        const res = await fetch(`/api/monitors/${encodeURIComponent(monitorId)}/stats`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Монитор не найден в базе данных');
            return;
          }
          throw new Error('Не удалось загрузить данные монитора');
        }
        const json = await res.json();
        setData(json);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Ошибка загрузки');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [monitorId],
  );

  useEffect(() => {
    if (!monitorId) return;

    fetchMonitorData();
    const interval = setInterval(() => fetchMonitorData(), 5000);
    return () => clearInterval(interval);
  }, [monitorId, fetchMonitorData]);

  const handleToggleStatus = async () => {
    if (!data || !monitorId) return;
    try {
      const res = await fetch(`/api/monitors/${monitorId}/toggle`, {
        method: 'POST',
      });
      if (res.ok) {
        fetchMonitorData();
      }
    } catch (err) {
      console.error('Ошибка переключения статуса', err);
    }
  };

  const openEditModal = () => {
    if (!data) return;
    setEditName(data.monitor.name);
    setEditUrl(data.monitor.url);
    setEditMethod(data.monitor.method);
    setEditInterval(data.monitor.interval);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monitorId) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/monitors/${monitorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          url: editUrl,
          method: editMethod,
          interval: editInterval,
        }),
      });

      if (res.ok) {
        setIsEditOpen(false);
        fetchMonitorData();
      } else {
        const errJson = await res.json();
        alert(errJson.error || 'Ошибка сохранения');
      }
    } catch (err) {
      alert('Не удалось сохранить изменения');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!monitorId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/monitors/${monitorId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/monitors');
      } else {
        alert('Ошибка при удалении монитора');
      }
    } catch (err) {
      alert('Не удалось удалить монитор');
    } finally {
      setDeleting(false);
    }
  };

  const formatDuration = (startStr: string, endStr: string | null) => {
    const start = new Date(startStr).getTime();
    const end = endStr ? new Date(endStr).getTime() : Date.now();
    const diffSec = Math.floor((end - start) / 1000);

    if (diffSec < 60) return `${diffSec} сек`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} мин ${diffSec % 60} сек`;
    const diffHours = Math.floor(diffMin / 60);
    return `${diffHours} ч ${diffMin % 60} мин`;
  };

  if (!monitorId) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <p className="text-sm font-mono text-zinc-400">Не указан идентификатор монитора.</p>
        <Link
          href="/monitors"
          className="inline-block px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-zinc-200 transition"
        >
          Вернуться к списку
        </Link>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-[#D4FF4F] animate-spin" />
        <p className="text-sm font-mono text-zinc-400">Загрузка детальной метрики...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Link
          href="/monitors"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition mb-6 font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> Назад к мониторам
        </Link>
        <div className="p-8 bg-zinc-900/60 border border-red-500/20 rounded-xl text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-white">{error || 'Монитор не найден'}</h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            Монитор с ID <code className="text-[#D4FF4F]">{monitorId}</code> не существует или был
            удален.
          </p>
          <button
            onClick={() => router.push('/monitors')}
            className="px-4 py-2 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-zinc-200 transition"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const { monitor, stats, pings, incidents } = data;
  const maxPingLatency = Math.max(...pings.map((p) => p.responseTime), 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div>
        <Link
          href="/monitors"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Назад к списку
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 border border-white/10 p-6 rounded-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                  monitor.status === 'UP'
                    ? 'bg-[#D4FF4F]/10 border-[#D4FF4F]/30 text-[#D4FF4F]'
                    : monitor.status === 'DOWN'
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    monitor.status === 'UP'
                      ? 'bg-[#D4FF4F] animate-pulse'
                      : monitor.status === 'DOWN'
                        ? 'bg-red-500 animate-pulse'
                        : 'bg-zinc-500'
                  }`}
                />
                {monitor.status}
              </span>

              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-zinc-800 border border-white/5 text-zinc-300 uppercase">
                {monitor.method}
              </span>

              <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Каждые {monitor.interval}s
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">{monitor.name}</h1>

            <a
              href={monitor.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-mono text-zinc-400 hover:text-[#D4FF4F] transition group"
            >
              {monitor.url}
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchMonitorData(true)}
              disabled={refreshing}
              className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Обновить"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#D4FF4F]' : ''}`} />
            </button>

            <button
              onClick={handleToggleStatus}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition ${
                monitor.status === 'PAUSED'
                  ? 'bg-[#D4FF4F]/10 border-[#D4FF4F]/30 text-[#D4FF4F] hover:bg-[#D4FF4F]/20'
                  : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {monitor.status === 'PAUSED' ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Возобновить
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" /> Пауза
                </>
              )}
            </button>

            <button
              onClick={openEditModal}
              className="p-2.5 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              title="Редактировать"
            >
              <Pencil className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
              title="Удалить"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Средняя задержка</span>
            <Zap className="w-4 h-4 text-[#D4FF4F]" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {stats.avgLatency} <span className="text-sm font-normal text-zinc-500">ms</span>
          </div>
          <p className="text-[11px] text-zinc-500">На основе последних {pings.length} проверок</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Мин. задержка</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-zinc-200 tracking-tight">
            {stats.minLatency} <span className="text-sm font-normal text-zinc-500">ms</span>
          </div>
          <p className="text-[11px] text-zinc-500">Лучший показатель отклика</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Макс. задержка</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-zinc-200 tracking-tight">
            {stats.maxLatency} <span className="text-sm font-normal text-zinc-500">ms</span>
          </div>
          <p className="text-[11px] text-zinc-500">Пиковая задержка</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Всего проверок</span>
            <Server className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white tracking-tight">
            {stats.totalChecks.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-500">
            Аптайм: <span className="text-[#D4FF4F] font-mono">{stats.uptimePercent}%</span>
          </p>
        </div>
      </div>

      {/* Response Time Bar Chart */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Время отклика (Response Time)</h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Последние {pings.length} проверок
            </p>
          </div>
          {hoveredPing && (
            <div className="text-right text-xs font-mono">
              <span className="text-zinc-400">
                {new Date(hoveredPing.createdAt).toLocaleTimeString()} —{' '}
              </span>
              <span className={hoveredPing.isUp ? 'text-[#D4FF4F]' : 'text-red-400 font-bold'}>
                {hoveredPing.responseTime} ms ({hoveredPing.statusCode || 'ERR'})
              </span>
            </div>
          )}
        </div>

        {pings.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm font-mono text-zinc-500">
            Нет данных проверок. Пожалуйста, подождите...
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-48 w-full flex items-end gap-1 pt-6 pb-2 px-1 border-b border-white/10">
              {pings.map((ping) => {
                const heightPercent = Math.max((ping.responseTime / maxPingLatency) * 100, 6);
                return (
                  <div
                    key={ping.id}
                    onMouseEnter={() => setHoveredPing(ping)}
                    onMouseLeave={() => setHoveredPing(null)}
                    className="flex-1 group relative flex flex-col justify-end h-full cursor-pointer"
                  >
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t transition-all duration-200 group-hover:brightness-125 ${
                        ping.isUp ? 'bg-[#D4FF4F]' : 'bg-red-500'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-1">
              <span>
                {pings.length > 0 ? new Date(pings[0].createdAt).toLocaleTimeString() : ''}
              </span>
              <span>Сейчас</span>
            </div>
          </div>
        )}
      </div>

      {/* Incidents Timeline */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">История инцидентов</h3>
            <p className="text-xs text-zinc-400 font-mono">
              Зафиксированные сбои и выходы из строя
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-white/5">
            Всего: {incidents.length}
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-white/10 rounded-xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#D4FF4F] mx-auto opacity-80" />
            <p className="text-sm text-zinc-300 font-medium">Инцидентов не зафиксировано</p>
            <p className="text-xs text-zinc-500 font-mono">Этот сервис работает без сбоев.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  {incident.status === 'ACTIVE' ? (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-[#D4FF4F] shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-semibold ${
                          incident.status === 'ACTIVE' ? 'text-red-400' : 'text-[#D4FF4F]'
                        }`}
                      >
                        {incident.status === 'ACTIVE' ? 'АКТИВНЫЙ СБОЙ' : 'ИСПРАВЛЕНО'}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">•</span>
                      <span className="text-xs text-zinc-400 font-mono">
                        {new Date(incident.startedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-mono text-zinc-200">
                      {incident.cause || 'Неизвестная ошибка ответа'}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-zinc-400 shrink-0">
                  <div>
                    Длительность:{' '}
                    <span className="text-white font-medium">
                      {formatDuration(incident.startedAt, incident.resolvedAt)}
                    </span>
                  </div>
                  {incident.resolvedAt && (
                    <div className="text-[11px] text-zinc-500">
                      Решено: {new Date(incident.resolvedAt).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Редактирование монитора</h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">Название</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">URL-адрес</label>
                <input
                  type="url"
                  required
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">HTTP Метод</label>
                  <select
                    value={editMethod}
                    onChange={(e) => setEditMethod(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="HEAD">HEAD</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400">Интервал (сек)</label>
                  <select
                    value={editInterval}
                    onChange={(e) => setEditInterval(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4FF4F]"
                  >
                    <option value={10}>10 сек</option>
                    <option value={30}>30 сек</option>
                    <option value={60}>60 сек (1 мин)</option>
                    <option value={300}>300 сек (5 мин)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
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
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-500/20 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="space-y-2 text-center">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
              <h2 className="text-lg font-bold text-white">Удалить монитор?</h2>
              <p className="text-xs text-zinc-400">
                Вы уверены, что хотите удалить{' '}
                <strong className="text-white">{monitor.name}</strong>? Это действие также удалит
                всю историю проверок и инцидентов.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? 'Удаление...' : 'Удалить навсегда'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
