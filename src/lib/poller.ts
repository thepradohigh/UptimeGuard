import { PrismaClient } from '@prisma/client';
import { formatDownEmailHtml, formatUpEmailHtml, sendEmailNotification } from './email';
import { formatDownAlert, formatUpAlert, sendTelegramNotification } from './telegram';

const globalForPoller = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  intervals: Map<string, NodeJS.Timeout> | undefined;
};

export const prisma = globalForPoller.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPoller.prisma = prisma;

if (!globalForPoller.intervals) {
  globalForPoller.intervals = new Map();
}
const activeIntervals = globalForPoller.intervals;

export function stopAllPollers() {
  for (const [id, interval] of activeIntervals.entries()) {
    clearInterval(interval);
  }
  activeIntervals.clear();
}

export async function checkMonitor(monitorId: string) {
  try {
    const monitor = await prisma.monitor.findUnique({
      where: { id: monitorId },
    });

    if (!monitor || monitor.status === 'PAUSED') {
      if (activeIntervals.has(monitorId)) {
        clearInterval(activeIntervals.get(monitorId)!);
        activeIntervals.delete(monitorId);
      }
      return;
    }

    const startTime = performance.now();
    let isUp = false;
    let statusCode: number | null = null;
    let errorCause: string | null = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(monitor.url, {
        method: monitor.method || 'GET',
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeout);
      statusCode = res.status;
      isUp = res.ok;
      if (!isUp) errorCause = `HTTP ${statusCode} ${res.statusText || 'Server Error'}`;
    } catch (error: any) {
      isUp = false;
      errorCause =
        error.name === 'AbortError' ? 'Connection Timeout' : error.message || 'Network Error';
    }

    const responseTime = Math.round(performance.now() - startTime);

    console.log(`🔍 [Check] ${monitor.name} -> ${isUp ? '🟢 UP' : '🔴 DOWN'} (${responseTime}ms)`);

    try {
      await prisma.ping.create({
        data: {
          monitorId: monitor.id,
          responseTime,
          statusCode,
          isUp,
        },
      });
    } catch (pingErr) {
      return;
    }

    const chatId = process.env.TELEGRAM_CHAT_ID;
    const recipientEmail = process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;

    // Восстановление (DOWN -> UP)
    if (isUp && monitor.status !== 'UP') {
      console.log(`🟢 [Status Change] ${monitor.name} RECOVERED!`);
      await prisma.monitor
        .update({ where: { id: monitor.id }, data: { status: 'UP' } })
        .catch(() => {});

      const activeIncident = await prisma.incident.findFirst({
        where: { monitorId: monitor.id, status: 'ACTIVE' },
        orderBy: { startedAt: 'desc' },
      });

      if (activeIncident) {
        const resolvedAt = new Date();
        await prisma.incident
          .update({
            where: { id: activeIncident.id },
            data: { status: 'RESOLVED', resolvedAt },
          })
          .catch(() => {});

        const durationMs = resolvedAt.getTime() - activeIncident.startedAt.getTime();
        const durationMins = Math.max(1, Math.round(durationMs / 60000));
        const durationStr = `${durationMins}m`;

        // 1. Алерт в Telegram
        if (chatId) {
          await sendTelegramNotification(
            chatId,
            formatUpAlert(monitor.name, monitor.url, durationStr),
          );
        }

        // 2. Алерт по Email
        if (recipientEmail) {
          const html = formatUpEmailHtml(monitor.name, monitor.url, durationStr);
          await sendEmailNotification(
            recipientEmail,
            `[RESOLVED] ${monitor.name} is back UP`,
            html,
          );
        }
      }
    }
    // Падение (UP -> DOWN)
    else if (!isUp && monitor.status !== 'DOWN') {
      console.log(`🔴 [Status Change] ${monitor.name} DOWN! Cause: ${errorCause}`);
      await prisma.monitor
        .update({ where: { id: monitor.id }, data: { status: 'DOWN' } })
        .catch(() => {});

      await prisma.incident
        .create({
          data: { monitorId: monitor.id, status: 'ACTIVE', cause: errorCause },
        })
        .catch(() => {});

      const causeStr = errorCause || 'Unknown Error';

      // 1. Алерт в Telegram
      if (chatId) {
        await sendTelegramNotification(
          chatId,
          formatDownAlert(monitor.name, monitor.url, causeStr),
        );
      }

      // 2. Алерт по Email
      if (recipientEmail) {
        const html = formatDownEmailHtml(monitor.name, monitor.url, causeStr);
        await sendEmailNotification(recipientEmail, `[ALERT] Service Down: ${monitor.name}`, html);
      }
    }
  } catch (err) {
    console.error(`Error checking monitor ${monitorId}:`, err);
  }
}

export async function startPoller() {
  stopAllPollers();
  console.log('🚀 Starting UptimeGuard Polling Engine...');

  const monitors = await prisma.monitor.findMany({
    where: { status: { not: 'PAUSED' } },
  });

  for (const monitor of monitors) {
    checkMonitor(monitor.id);

    const intervalId = setInterval(
      () => {
        checkMonitor(monitor.id);
      },
      Math.max(monitor.interval, 5) * 1000,
    );

    activeIntervals.set(monitor.id, intervalId);
  }
}
