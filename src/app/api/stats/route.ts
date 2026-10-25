import { prisma } from '@/lib/poller';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const monitors = await prisma.monitor.findMany({
      include: {
        pings: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = monitors.length;
    const up = monitors.filter((m) => m.status === 'UP').length;
    const down = monitors.filter((m) => m.status === 'DOWN').length;

    let totalLatency = 0;
    let latencyCount = 0;

    const monitorList = monitors.map((m) => {
      const lastPing = m.pings[0];
      if (lastPing && lastPing.isUp) {
        totalLatency += lastPing.responseTime;
        latencyCount++;
      }
      return {
        id: m.id,
        name: m.name,
        url: m.url,
        status: m.status,
        latency: lastPing ? `${lastPing.responseTime}ms` : '--',
      };
    });

    const avgLatency = latencyCount > 0 ? Math.round(totalLatency / latencyCount) : 0;

    return NextResponse.json({
      stats: {
        total,
        up,
        down,
        avgLatency: `${avgLatency}ms`,
      },
      monitors: monitorList,
    });
  } catch (err) {
    console.error('Stats Error:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
