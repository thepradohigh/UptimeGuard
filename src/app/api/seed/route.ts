import { prisma, startPoller, stopAllPollers } from '@/lib/poller';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Останавливаем активные фоновые проверки
    await stopAllPollers();
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 2. Полностью очищаем старые данные
    await prisma.ping.deleteMany({});
    await prisma.incident.deleteMany({});
    await prisma.monitor.deleteMany({});

    // 3. Список инфраструктурных мониторов
    const seedMonitors = [
      {
        name: 'GitHub REST & GraphQL API',
        url: 'https://api.github.com',
        method: 'GET',
        interval: 15,
        status: 'UP' as const,
      },
      {
        name: 'Cloudflare Edge DNS (1.1.1.1)',
        url: 'https://1.1.1.1',
        method: 'GET',
        interval: 10,
        status: 'UP' as const,
      },
      {
        name: 'Stripe Payment Gateway',
        url: 'https://api.stripe.com',
        method: 'GET',
        interval: 30,
        status: 'UP' as const,
      },
      {
        name: 'OpenAI Model Inference API',
        url: 'https://api.openai.com/v1/models',
        method: 'GET',
        interval: 15,
        status: 'UP' as const,
      },
      {
        name: 'Legacy Billing Service (v1)',
        url: 'https://httpbin.org/status/500',
        method: 'GET',
        interval: 10,
        status: 'DOWN' as const,
      },
      {
        name: 'Vercel Global Edge Network',
        url: 'https://vercel.com',
        method: 'GET',
        interval: 30,
        status: 'UP' as const,
      },
      {
        name: 'Auth0 Identity Provider',
        url: 'https://httpbin.org/status/200',
        method: 'GET',
        interval: 60,
        status: 'UP' as const,
      },
      {
        name: 'PostgreSQL Primary Cluster (EU-Central)',
        url: 'https://httpbin.org/status/200',
        method: 'GET',
        interval: 15,
        status: 'UP' as const,
      },
      {
        name: 'External ERP Integration Endpoint',
        url: 'https://httpbin.org/status/503',
        method: 'POST',
        interval: 10,
        status: 'DOWN' as const,
      },
      {
        name: 'Redis Cache Cluster (Node 01)',
        url: 'https://httpbin.org/status/200',
        method: 'GET',
        interval: 60,
        status: 'PAUSED' as const,
      },
      {
        name: 'AWS S3 Static Asset Bucket',
        url: 'https://httpbin.org/status/200',
        method: 'HEAD',
        interval: 30,
        status: 'UP' as const,
      },
      {
        name: 'Customer Portal Dashboard Frontend',
        url: 'https://httpbin.org/status/200',
        method: 'GET',
        interval: 15,
        status: 'UP' as const,
      },
      {
        name: 'Elasticsearch Log Aggregator',
        url: 'https://httpbin.org/status/200',
        method: 'GET',
        interval: 60,
        status: 'UP' as const,
      },
      {
        name: 'WebSocket Realtime Push Gateway',
        url: 'https://httpbin.org/status/200',
        method: 'GET',
        interval: 10,
        status: 'UP' as const,
      },
      {
        name: 'Google Public DNS Proxy',
        url: 'https://8.8.8.8',
        method: 'GET',
        interval: 30,
        status: 'UP' as const,
      },
    ];

    const createdMonitors = [];

    // 4. Создаем мониторы, историю пингов и инциденты
    for (const monitorData of seedMonitors) {
      const monitor = await prisma.monitor.create({
        data: monitorData,
      });
      createdMonitors.push(monitor);

      // Генерируем 45 исторических пингов для плотности графика
      const now = Date.now();
      const pingsToCreate = [];

      for (let i = 45; i >= 0; i--) {
        const pingTime = new Date(now - i * 60 * 1000); // Раз в минуту за последние 45 минут
        const isUp = monitor.status === 'DOWN' ? (i < 10 ? false : true) : true;
        const baseLatency =
          monitor.name.includes('AWS') || monitor.name.includes('Cloudflare') ? 18 : 85;
        const responseTime = isUp
          ? Math.floor(baseLatency + Math.random() * 45)
          : Math.floor(1200 + Math.random() * 800);

        pingsToCreate.push({
          monitorId: monitor.id,
          responseTime,
          statusCode: isUp ? 200 : monitor.status === 'DOWN' ? 500 : 503,
          isUp,
          createdAt: pingTime,
        });
      }

      await prisma.ping.createMany({
        data: pingsToCreate,
      });

      // 5. Создаем инциденты для упавших и нестабильных сервисов
      if (monitor.status === 'DOWN') {
        await prisma.incident.create({
          data: {
            monitorId: monitor.id,
            status: 'ACTIVE',
            cause: 'HTTP 500 Internal Server Error (Таймаут соединения с базой)',
            startedAt: new Date(now - 10 * 60 * 1000), // Начался 10 минут назад
          },
        });
      }

      // Добавим один исторически решенный инцидент для реалистичности
      if (monitor.name.includes('Stripe') || monitor.name.includes('GitHub')) {
        await prisma.incident.create({
          data: {
            monitorId: monitor.id,
            status: 'RESOLVED',
            cause: 'Высокая задержка отклика сетевого шлюза (High Latency Spike)',
            startedAt: new Date(now - 120 * 60 * 1000),
            resolvedAt: new Date(now - 95 * 60 * 1000),
          },
        });
      }
    }

    // 6. Перезапускаем фоновый движок проверок
    await startPoller();

    return NextResponse.json({
      success: true,
      message: 'База данных успешно наполнена 15 тестовыми мониторами и пингами!',
      count: createdMonitors.length,
    });
  } catch (error: any) {
    console.error('Ошибка сидинга:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
