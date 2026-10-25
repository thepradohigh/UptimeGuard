import { prisma } from '@/lib/poller';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 },
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        password, // В боевом проекте тут был бы bcrypt.hash
        name: name || email.split('@')[0],
      },
    });

    const token = `token_${user.id}_${Date.now()}`;

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Ошибка при создании аккаунта' }, { status: 500 });
  }
}
