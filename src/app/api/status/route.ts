import { prisma } from '@/lib/poller';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const monitors = await prisma.monitor.findMany({
      where: { status: { not: 'PAUSED' } },
      orderBy: { createdAt: 'asc' },
    });

    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const result = await Promise.all(
      monitors.map(async (monitor) => {
        // Получаем все пинги за 90 дней
        const pings = await prisma.ping.findMany({
          where: {
            monitorId: monitor.id,
            createdAt: { gte: ninetyDaysAgo },
          },
          select: { isUp: true, createdAt: true, responseTime: true },
          orderBy: { createdAt: 'asc' },
        });

        // Группируем по дням
        const dailyStats: Record<string, { total: number; up: number }> = {};
        for (let i = 0; i < 90; i++) {
          const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dayKey = day.toISOString().split('T')[0];
          dailyStats[dayKey] = { total: 0, up: 0 };
        }

        for (const ping of pings) {
          const dayKey = ping.createdAt.toISOString().split('T')[0];
          if (dailyStats[dayKey]) {
            dailyStats[dayKey].total++;
            if (ping.isUp) dailyStats[dayKey].up++;
          }
        }

        // Преобразуем в массив (от старых к новым)
        const days = Object.entries(dailyStats)
          .map(([date, stats]) => ({
            date,
            uptime: stats.total > 0 ? Math.round((stats.up / stats.total) * 100) : -1,
          }))
          .reverse();

        // Считаем общий аптайм
        const totalPings = pings.length;
        const upPings = pings.filter((p) => p.isUp).length;
        const overallUptime = totalPings > 0 ? ((upPings / totalPings) * 100).toFixed(2) : '100.00';

        const avgLatency =
          pings.length > 0
            ? Math.round(pings.reduce((sum, p) => sum + p.responseTime, 0) / pings.length)
            : 0;

        return {
          id: monitor.id,
          name: monitor.name,
          url: monitor.url,
          status: monitor.status,
          uptime: overallUptime,
          avgLatency: `${avgLatency}ms`,
          days,
        };
      }),
    );

    const allUp = result.every((m) => m.status === 'UP');

    return NextResponse.json({
      overall: allUp ? 'operational' : 'degraded',
      monitors: result,
      updatedAt: now.toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
