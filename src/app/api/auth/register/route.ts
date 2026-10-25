import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signAccessToken, signRefreshToken, getRefreshExpiry } from "@/lib/jwt";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const v = registerSchema.safeParse(body);
    if (!v.success) return NextResponse.json({ error: "Validation failed", details: v.error.flatten().fieldErrors }, { status: 400 });

    const { email, password, name } = v.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash, name }, select: { id: true, email: true, name: true, telegramChatId: true, emailNotifications: true, notifyCooldown: true, maxMonitors: true, createdAt: true } });

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });
    await prisma.session.create({ data: { userId: user.id, refreshToken, expiresAt: getRefreshExpiry() } });

    return NextResponse.json({ data: { user, accessToken, refreshToken } }, { status: 201 });
  } catch (error: any) {
    console.error("[Register]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}