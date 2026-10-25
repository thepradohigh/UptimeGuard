import { prisma, startPoller, stopAllPollers } from '@/lib/poller';
import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Останавливаем все интервалы
  stopAllPollers();

  // Даем 500мс завершиться всем текущим асинхронным запросам
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 2. Чистим таблицы
  await prisma.ping.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.monitor.deleteMany();

  // 3. Создаем мониторы:
  // - "Failing Service": сбойный урл (500 Error), вызовет переход UP -> DOWN и отправит алерт!
  // - "GitHub API": рабочий урл
  await prisma.monitor.create({
    data: {
      name: 'Payment Gateway (500 Fail)',
      url: 'https://httpbin.org/status/500',
      interval: 10,
      status: 'UP',
    },
  });

  await prisma.monitor.create({
    data: {
      name: 'GitHub API',
      url: 'https://api.github.com',
      interval: 15,
      status: 'UP',
    },
  });

  // 4. Запускаем чистый поллинг
  await startPoller();

  return NextResponse.json({
    success: true,
    message: "Seed completed. 'Payment Gateway' will fail in 10s and trigger Telegram alert!",
  });
}
