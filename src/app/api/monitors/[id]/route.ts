import { NextResponse } from "next/server";
import { prisma, startPoller } = await import("@/lib/poller");

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const monitor = await prisma.monitor.findUnique({
      where: { id: params.id },
    });

    if (!monitor) {
      return NextResponse.json({ error: "Не найден" }, { status: 404 });
    }

    return NextResponse.json(monitor);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, url, method, interval, status } = body;

    const updated = await prisma.monitor.update({
      where: { id: params.id },
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ping.deleteMany({ where: { monitorId: params.id } });
    await prisma.incident.deleteMany({ where: { monitorId: params.id } });
    await prisma.monitor.delete({ where: { id: params.id } });

    await startPoller();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
