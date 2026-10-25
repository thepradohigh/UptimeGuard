import { prisma } from '@/lib/poller';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const monitor = await prisma.monitor.findUnique({
      where: { id },
    });

    if (!monitor) {
      return NextResponse.json({ error: 'Монитор не найден' }, { status: 404 });
    }

    // Get last 50 pings
    const pings = await prisma.ping.findMany({
      where: { monitorId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Revert pings for linear chart display (oldest to newest)
    const reversedPings = [...pings].reverse();

    // Get incidents
    const incidents = await prisma.incident.findMany({
      where: { monitorId: id },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    // Calculate latency metrics
    const totalChecks = await prisma.ping.count({
      where: { monitorId: id },
    });

    const upChecks = await prisma.ping.count({
      where: { monitorId: id, isUp: true },
    });

    const latencies = pings.map((p) => p.responseTime);
    const avgLatency =
      latencies.length > 0
        ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
        : 0;
    const minLatency = latencies.length > 0 ? Math.min(...latencies) : 0;
    const maxLatency = latencies.length > 0 ? Math.max(...latencies) : 0;

    const uptimePercent = totalChecks > 0 ? ((upChecks / totalChecks) * 100).toFixed(2) : '100.00';

    return NextResponse.json({
      monitor,
      stats: {
        avgLatency,
        minLatency,
        maxLatency,
        totalChecks,
        uptimePercent,
      },
      pings: reversedPings,
      incidents,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Ошибка сервера' }, { status: 500 });
  }
}
