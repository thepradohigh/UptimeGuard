import { prisma } from '@/lib/poller';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        monitor: {
          select: { name: true, url: true },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(incidents);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
  }
}
