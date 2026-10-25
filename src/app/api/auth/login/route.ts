import { prisma } from '@/lib/poller';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { email } });

    // Автоматическое создание дефолтного админа для удобства первого входа
    if (!user && email === 'admin@uptimeguard.dev' && password === 'password123') {
      user = await prisma.user.create({
        data: { email, password, name: 'Admin Account' },
      });
    }

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
    }

    const token = `token_${user.id}_${Date.now()}`;

    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Ошибка авторизации' }, { status: 500 });
  }
}
