import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest, unauthorized } from "@/lib/auth";
import { monitorSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();

  try {
    const monitors = await prisma.monitor.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: "desc" },
    });

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const withStats = await Promise.all(monitors.map(async (m) => {
      const checks = await prisma.check.findMany({ where: { monitorId: m.id, createdAt: { gte: since } }, select: { status: true, responseTime: true } });
      const up = checks.filter((c) => c.status === "UP").length;
      const uptime24h = checks.length > 0 ? Math.round((up / checks.length) * 10000) / 100 : 100;
      const rts = checks.filter((c) => c.responseTime !== null).map((c) => c.responseTime!);
      const avgRT = rts.length > 0 ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : 0;
      return { ...m, uptime24h, avgResponseTime: avgRT };
    }));

    return NextResponse.json({ data: withStats });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();

  try {
    const body = await request.json();
    const v = monitorSchema.safeParse(body);
    if (!v.success) return NextResponse.json({ error: "Validation failed", details: v.error.flatten().fieldErrors }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: auth.userId }, select: { maxMonitors: true } });
    const count = await prisma.monitor.count({ where: { userId: auth.userId } });
    if (count >= (user?.maxMonitors || 50)) return NextResponse.json({ error: "Monitor limit reached" }, { status: 403 });

    const monitor = await prisma.monitor.create({ data: { ...v.data, userId: auth.userId } });
    return NextResponse.json({ data: monitor }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}