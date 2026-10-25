import { formatDownAlert, sendTelegramNotification } from '@/lib/telegram';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const chatId = body.chatId || process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID не найден. Укажите Chat ID в .env или в поле ввода.' },
        { status: 400 },
      );
    }

    const alertMessage = formatDownAlert(
      'api.production.internal',
      'https://api.uptimeguard.dev',
      '503 Service Unavailable',
    );

    const success = await sendTelegramNotification(chatId, alertMessage);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Тестовый алерт успешно отправлен в Telegram!',
      });
    } else {
      return NextResponse.json(
        { error: 'Не удалось отправить сообщение. Проверьте TELEGRAM_BOT_TOKEN и Chat ID.' },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
