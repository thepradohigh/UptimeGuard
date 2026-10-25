import { prisma, startPoller } from '@/lib/poller';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const monitor = await prisma.monitor.findUnique({
      where: { id },
    });

    if (!monitor) {
      return NextResponse.json({ error: 'Не найден' }, { status: 404 });
    }

    return NextResponse.json(monitor);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, url, method, interval, status } = body;

    const updated = await prisma.monitor.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(url && { url }),
        ...(method && { method }),
        ...(interval && { interval: Number(interval) }),
        ...(status && { status }),
      },
    });

    await startPoller();

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.ping.deleteMany({ where: { monitorId: id } });
    await prisma.incident.deleteMany({ where: { monitorId: id } });
    await prisma.monitor.delete({ where: { id } });

    await startPoller();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
