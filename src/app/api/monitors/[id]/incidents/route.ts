import { authenticateRequest, forbidden, unauthorized } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth) return unauthorized();

    const monitor = await prisma.monitor.findUnique({ where: { id: params.id } });
    if (!monitor) return Response.json({ error: 'Not found' }, { status: 404 });
    if (monitor.userId !== auth.userId) return forbidden();

    const incidents = await prisma.incident.findMany({
      where: { monitorId: params.id },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });

    return Response.json({ data: incidents });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
