import { prisma, startPoller } from '@/lib/poller';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const monitor = await prisma.monitor.findUnique({
      where: { id: params.id },
    });

    if (!monitor) {
      return NextResponse.json({ error: 'Monitor not found' }, { status: 404 });
    }

    const newStatus = monitor.status === 'PAUSED' ? 'UP' : 'PAUSED';

    const updated = await prisma.monitor.update({
      where: { id: params.id },
      data: { status: newStatus },
    });

    // Перезапускаем поллер, чтобы снять/поставить на таймер
    await startPoller();

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to toggle monitor status' }, { status: 500 });
  }
}
