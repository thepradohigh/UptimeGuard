import { prisma, startPoller } from '@/lib/poller';
import { NextResponse } from 'next/server';

// GET /api/monitors — получить список всех мониторов с последним пингом
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

    const result = monitors.map((m) => {
      const lastPing = m.pings[0];
      return {
        id: m.id,
        name: m.name,
        url: m.url,
        method: m.method,
        interval: m.interval,
        status: m.status,
        latency: lastPing ? `${lastPing.responseTime}ms` : '--',
        lastCheckedAt: lastPing ? lastPing.createdAt : null,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch monitors' }, { status: 500 });
  }
}

// POST /api/monitors — создать новый монитор
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, url, method = 'GET', interval = 60 } = body;

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 });
    }

    const newMonitor = await prisma.monitor.create({
      data: {
        name,
        url,
        method,
        interval: Number(interval),
        status: 'UP',
      },
    });

    // Перезапускаем поллер, чтобы подхватить новый монитор
    await startPoller();

    return NextResponse.json(newMonitor, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create monitor' }, { status: 500 });
  }
}
