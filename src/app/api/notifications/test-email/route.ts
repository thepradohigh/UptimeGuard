import { formatDownEmailHtml, sendEmailNotification } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetEmail = body.email || process.env.NOTIFICATION_EMAIL || process.env.SMTP_USER;

    if (!targetEmail) {
      return NextResponse.json(
        { error: 'Укажите Email получателя в поле или в NOTIFICATION_EMAIL в .env' },
        { status: 400 },
      );
    }

    const html = formatDownEmailHtml(
      'api.production.internal',
      'https://api.uptimeguard.dev',
      '503 Service Unavailable',
    );

    const result = await sendEmailNotification(
      targetEmail,
      '[ALERT] Service Down: api.production.internal',
      html,
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Тестовое письмо успешно отправлено на ${targetEmail}`,
      });
    } else {
      return NextResponse.json({ error: `SMTP Error: ${result.error}` }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Внутренняя ошибка сервера' },
      { status: 500 },
    );
  }
}
