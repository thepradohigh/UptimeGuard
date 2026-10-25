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

    const totalChecks = await prisma.check.count({ where: { monitorId: params.id } });
    const upChecks = await prisma.check.count({ where: { monitorId: params.id, status: 'UP' } });

    const avgResult = await prisma.check.aggregate({
      where: { monitorId: params.id, responseTime: { not: null } },
      _avg: { responseTime: true },
    });

    const totalIncidents = await prisma.incident.count({ where: { monitorId: params.id } });

    const uptime = totalChecks > 0 ? (upChecks / totalChecks) * 100 : 100;

    return Response.json({
      data: {
        uptime: Math.round(uptime * 100) / 100,
        avgResponseTime: Math.round(avgResult._avg.responseTime || 0),
        totalChecks,
        totalIncidents,
      },
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
