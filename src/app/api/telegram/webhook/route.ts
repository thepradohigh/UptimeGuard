import { sendTelegramNotification } from '@/lib/telegram';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();

    if (text === '/start') {
      await sendTelegramNotification(
        chatId,
        `👋 <b>UptimeGuard Monitoring Bot</b>\n\n` +
          `Ваш Chat ID: <code>${chatId}</code>\n\n` +
          `Добавьте этот ID в настройки UptimeGuard для получения уведомлений о сбоях.\n\n` +
          `<b>Команды:</b>\n` +
          `/status — Текущее состояние сервисов\n` +
          `/id — Показать ваш Chat ID`,
      );
    } else if (text === '/id') {
      await sendTelegramNotification(chatId, `Ваш Chat ID: <code>${chatId}</code>`);
    } else if (text === '/status') {
      await sendTelegramNotification(
        chatId,
        `📊 <b>Состояние инфраструктуры</b>\n\n` +
          `<b>Мониторы:</b> 12 всего\n` +
          `🟢 <b>Online:</b> 11\n` +
          `🔴 <b>Offline:</b> 1\n` +
          `<b>Средняя задержка:</b> 32ms`,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Telegram Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
