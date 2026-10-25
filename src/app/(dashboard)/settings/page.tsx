'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [chatId, setChatId] = useState('');
  const [email, setEmail] = useState('');

  const [tgLoading, setTgLoading] = useState(false);
  const [tgStatus, setTgStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null,
  );

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleTestTelegram = async () => {
    setTgLoading(true);
    setTgStatus(null);

    try {
      const res = await fetch('/api/notifications/test-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatId.trim() || undefined }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTgStatus({
          type: 'success',
          text: data.message || 'Тестовый алерт отправлен в Telegram!',
        });
      } else {
        setTgStatus({ type: 'error', text: data.error || 'Ошибка при отправке сообщения' });
      }
    } catch (err) {
      setTgStatus({ type: 'error', text: 'Сетевая ошибка при вызове API' });
    } finally {
      setTgLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setEmailLoading(true);
    setEmailStatus(null);

    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() || undefined }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEmailStatus({ type: 'success', text: data.message || 'Тестовое письмо отправлено!' });
      } else {
        setEmailStatus({ type: 'error', text: data.error || 'Ошибка при отправке письма' });
      }
    } catch (err) {
      setEmailStatus({ type: 'error', text: 'Сетевая ошибка при вызове API' });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-serif-display text-4xl text-white tracking-tight">Settings</h1>
        <p className="text-zinc-400 text-[14px] mt-2">
          Manage notification channels and system preferences.
        </p>
      </div>

      {/* Telegram Section */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-[16px] font-semibold text-white">Telegram Notifications</h2>
          <p className="text-[13px] text-zinc-400 mt-1">
            Receive instant downtime notifications directly in your Telegram chat.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[12px] font-mono uppercase text-zinc-400 mb-2">
              Telegram Chat ID (Опционально, если передан в .env)
            </label>
            <input
              type="text"
              placeholder="Например: 7377241551"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="w-full h-10 px-4 rounded-lg bg-black border border-white/10 text-white text-[13px] font-mono focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {tgStatus && (
            <div
              className={`p-4 rounded-lg border text-[13px] font-mono ${tgStatus.type === 'success' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-red-950/30 border-red-500/30 text-red-300'}`}
            >
              {tgStatus.type === 'success' ? '✓ ' : '✕ '}
              {tgStatus.text}
            </div>
          )}

          <button
            onClick={handleTestTelegram}
            disabled={tgLoading}
            className="h-10 px-6 rounded-lg bg-white text-black text-[13px] font-medium hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {tgLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : null}
            <span>Проверить Telegram алерт</span>
          </button>
        </div>
      </div>

      {/* Email / SMTP Section */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-[16px] font-semibold text-white">Email (SMTP) Notifications</h2>
          <p className="text-[13px] text-zinc-400 mt-1">
            Receive dark-mode HTML alert emails when a target service goes down.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-[12px] font-mono uppercase text-zinc-400 mb-2">
              Notification Email Recipient
            </label>
            <input
              type="email"
              placeholder="Например: admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-4 rounded-lg bg-black border border-white/10 text-white text-[13px] font-mono focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          {emailStatus && (
            <div
              className={`p-4 rounded-lg border text-[13px] font-mono ${emailStatus.type === 'success' ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-red-950/30 border-red-500/30 text-red-300'}`}
            >
              {emailStatus.type === 'success' ? '✓ ' : '✕ '}
              {emailStatus.text}
            </div>
          )}

          <button
            onClick={handleTestEmail}
            disabled={emailLoading}
            className="h-10 px-6 rounded-lg bg-white text-black text-[13px] font-medium hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {emailLoading ? (
              <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : null}
            <span>Проверить Email алерт</span>
          </button>
        </div>
      </div>
    </div>
  );
}
