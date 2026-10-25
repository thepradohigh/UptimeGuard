import { prisma, startPoller } from '@/lib/poller';
import { NextResponse } from 'next/server';

// PATCH (Обновление монитора)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { name, url, method, interval } = body;

    const updatedMonitor = await prisma.monitor.update({
      where: { id: params.id },
      data: {
        name,
        url,
        method,
        interval: Number(interval),
      },
    });

    // Перезапускаем поллер для обновления интервалов
    await startPoller();

    return NextResponse.json(updatedMonitor);
  } catch (err) {
    console.error('Update error:', err);
    return NextResponse.json({ error: 'Failed to update monitor' }, { status: 500 });
  }
}

// DELETE (Удаление монитора)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.monitor.delete({
      where: { id: params.id },
    });

    // Перезапускаем поллер, чтобы остановить проверку удаленного монитора
    await startPoller();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Failed to delete monitor' }, { status: 500 });
  }
}
