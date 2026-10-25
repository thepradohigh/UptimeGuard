import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyRefreshToken, signAccessToken, signRefreshToken, getRefreshExpiry } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    if (!refreshToken) return NextResponse.json({ error: "Refresh token required" }, { status: 400 });

    let payload;
    try { payload = verifyRefreshToken(refreshToken); } catch { return NextResponse.json({ error: "Invalid token" }, { status: 401 }); }

    const session = await prisma.session.findUnique({ where: { refreshToken } });
    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.session.delete({ where: { id: session.id } });
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const newAccess = signAccessToken({ userId: payload.userId, email: payload.email });
    const newRefresh = signRefreshToken({ userId: payload.userId, email: payload.email });
    await prisma.session.update({ where: { id: session.id }, data: { refreshToken: newRefresh, expiresAt: getRefreshExpiry() } });

    return NextResponse.json({ data: { accessToken: newAccess, refreshToken: newRefresh } });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}