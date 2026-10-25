'use client';

import { CheckCircle2, Loader2, Mail, Save, Send, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  // Telegram State
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [savingTg, setSavingTg] = useState(false);
  const [testingTg, setTestingTg] = useState(false);
  const [tgFeedback, setTgFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Email State
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('465');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    // Загружаем сохраненные настройки
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.telegramBotToken) setTelegramBotToken(data.telegramBotToken);
        if (data.telegramChatId) setTelegramChatId(data.telegramChatId);
        if (data.smtpHost) setSmtpHost(data.smtpHost);
        if (data.smtpPort) setSmtpPort(data.smtpPort);
        if (data.smtpUser) setSmtpUser(data.smtpUser);
        if (data.smtpPass) setSmtpPass(data.smtpPass);
        if (data.notificationEmail) setNotificationEmail(data.notificationEmail);
      })
      .catch((err) => console.error('Ошибка загрузки настроек', err));
  }, []);

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTg(true);
    setTgFeedback(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramBotToken,
          telegramChatId,
        }),
      });

      if (res.ok) {
        setTgFeedback({
          type: 'success',
          message: 'Настройки Telegram успешно сохранены!',
        });
      } else {
        setTgFeedback({
          type: 'error',
          message: 'Ошибка при сохранении настроек Telegram',
        });
      }
    } catch (err) {
      setTgFeedback({
        type: 'error',
        message: 'Сетевая ошибка при сохранении',
      });
    } finally {
      setSavingTg(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTg(true);
    setTgFeedback(null);
    try {
      const res = await fetch('/api/notifications/test-telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: telegramChatId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setTgFeedback({
          type: 'success',
          message: 'Тестовое сообщение отправлено в Telegram!',
        });
      } else {
        setTgFeedback({
          type: 'error',
          message: data.error || 'Ошибка отправки в Telegram',
        });
      }
    } catch (err: any) {
      setTgFeedback({
        type: 'error',
        message: 'Сетевая ошибка при отправке',
      });
    } finally {
      setTestingTg(false);
    }
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEmail(true);
    setEmailFeedback(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass,
          notificationEmail,
          smtpFrom: `UptimeGuard <${smtpUser}>`,
        }),
      });

      if (res.ok) {
        setEmailFeedback({
          type: 'success',
          message: 'Настройки Email успешно сохранены!',
        });
      } else {
        setEmailFeedback({
          type: 'error',
          message: 'Ошибка при сохранении настроек Email',
        });
      }
    } catch (err) {
      setEmailFeedback({
        type: 'error',
        message: 'Сетевая ошибка при сохранении',
      });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setEmailFeedback(null);
    try {
      const res = await fetch('/api/notifications/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notificationEmail }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEmailFeedback({
          type: 'success',
          message: 'Тестовое письмо успешно отправлено!',
        });
      } else {
        setEmailFeedback({
          type: 'error',
          message: data.error || 'Ошибка отправки Email',
        });
      }
    } catch (err: any) {
      setEmailFeedback({
        type: 'error',
        message: 'Сетевая ошибка при отправке письма',
      });
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Каналы оповещений</h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Управление ботом Telegram и SMTP-сервером для алертов о сбоях
        </p>
      </div>

      {/* Telegram Section */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Telegram Bot</h2>
              <p className="text-xs text-zinc-400 font-mono">
                Мгновенные сообщения при падении или восстановлении сервиса
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Активно
          </span>
        </div>

        <form onSubmit={handleSaveTelegram} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Bot Token</label>
              <input
                type="text"
                placeholder="8978965543:AAHIrDLdq..."
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4FF4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Telegram Chat ID</label>
              <input
                type="text"
                placeholder="7377241551"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4FF4F]"
              />
            </div>
          </div>

          {tgFeedback && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                tgFeedback.type === 'success'
                  ? 'bg-[#D4FF4F]/10 border-[#D4FF4F]/30 text-[#D4FF4F]'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {tgFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0" />
              )}
              {tgFeedback.message}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testingTg}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition disabled:opacity-50"
            >
              {testingTg ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-sky-400" />
              )}
              Проверить алерт
            </button>

            <button
              type="submit"
              disabled={savingTg}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition disabled:opacity-50 shadow-lg"
            >
              {savingTg ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Сохранить Telegram
            </button>
          </div>
        </form>
      </div>

      {/* Email SMTP Section */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Email (SMTP Server)</h2>
              <p className="text-xs text-zinc-400 font-mono">
                Отправка писем через Gmail App Password или свой SMTP
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Активно
          </span>
        </div>

        <form onSubmit={handleSaveEmail} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">SMTP Host</label>
              <input
                type="text"
                value={smtpHost}
                onChange={(e) => setSmtpHost(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4FF4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">SMTP Port</label>
              <input
                type="text"
                value={smtpPort}
                onChange={(e) => setSmtpPort(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4FF4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">SMTP User / Email</label>
              <input
                type="email"
                placeholder="uptimeguardadmin@gmail.com"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4FF4F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">SMTP App Password</label>
              <input
                type="password"
                placeholder="•••• •••• •••• ••••"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4FF4F]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400">
              Email для получения уведомлений
            </label>
            <input
              type="email"
              placeholder="uptimeguardadmin@gmail.com"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#D4FF4F]"
            />
          </div>

          {emailFeedback && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                emailFeedback.type === 'success'
                  ? 'bg-[#D4FF4F]/10 border-[#D4FF4F]/30 text-[#D4FF4F]'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              {emailFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 shrink-0" />
              )}
              {emailFeedback.message}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={testingEmail}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition disabled:opacity-50"
            >
              {testingEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-amber-400" />
              )}
              Проверить алерт
            </button>

            <button
              type="submit"
              disabled={savingEmail}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition disabled:opacity-50 shadow-lg"
            >
              {savingEmail ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Сохранить Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
