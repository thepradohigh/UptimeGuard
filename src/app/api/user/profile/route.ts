import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticateRequest, unauthorized } from "@/lib/auth";
import { profileSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, email: true, name: true, telegramChatId: true, emailNotifications: true, notifyCooldown: true, maxMonitors: true, createdAt: true },
  });
  return NextResponse.json({ data: user });
}

export async function PUT(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) return unauthorized();
  const body = await request.json();
  const v = profileSchema.safeParse(body);
  if (!v.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: v.data,
    select: { id: true, email: true, name: true, telegramChatId: true, emailNotifications: true, notifyCooldown: true, maxMonitors: true, createdAt: true },
  });
  return NextResponse.json({ data: user });
}