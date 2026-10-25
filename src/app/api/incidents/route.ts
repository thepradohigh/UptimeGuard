import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest, unauthorized } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const where: any = { monitor: { userId: auth.userId } };
  if (status === "active") where.resolvedAt = null;
  else if (status === "resolved") where.resolvedAt = { not: null };

  const incidents = await prisma.incident.findMany({
    where,
    include: { monitor: { select: { name: true, url: true } } },
    orderBy: { startedAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ data: incidents });
}