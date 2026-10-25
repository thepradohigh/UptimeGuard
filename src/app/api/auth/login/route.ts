import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signAccessToken, signRefreshToken, getRefreshExpiry } from "@/lib/jwt";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const v = loginSchema.safeParse(body);
    if (!v.success) return NextResponse.json({ error: "Validation failed" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: v.data.email } });
    if (!user) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await bcrypt.compare(v.data.password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id, email: user.email });

    await prisma.session.deleteMany({ where: { userId: user.id, expiresAt: { lt: new Date() } } });
    await prisma.session.create({ data: { userId: user.id, refreshToken, expiresAt: getRefreshExpiry() } });

    const { passwordHash, ...safe } = user;
    return NextResponse.json({ data: { user: safe, accessToken, refreshToken } });
  } catch (error: any) {
    console.error("[Login]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}