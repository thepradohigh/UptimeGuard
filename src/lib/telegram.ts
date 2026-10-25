export async function sendTelegramNotification(chatId: string | number, message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.warn('⚠️ [Telegram] TELEGRAM_BOT_TOKEN не задан в .env');
    return { success: false, error: 'TELEGRAM_BOT_TOKEN отсутствует' };
  }

  try {
    console.log(`📡 [Telegram] Отправка уведомления в Chat ID: ${chatId}...`);

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      console.error(`❌ [Telegram Error]: ${data.description}`);
      return { success: false, error: data.description || 'Telegram API Error' };
    }

    console.log('✅ [Telegram] Сообщение успешно доставлено!');
    return { success: true };
  } catch (error: any) {
    console.error('❌ [Telegram Fetch Error]:', error?.message || error);
    return { success: false, error: error?.message || 'Ошибка сети' };
  }
}

export function formatDownAlert(monitorName: string, url: string, reason: string) {
  const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return (
    `🔴 <b>ALERT: Service Down</b>\n\n` +
    `<b>Monitor:</b> <code>${monitorName}</code>\n` +
    `<b>Target:</b> ${url}\n` +
    `<b>Reason:</b> <code>${reason}</code>\n` +
    `<b>Time:</b> <code>${time} UTC</code>`
  );
}

export function formatUpAlert(monitorName: string, url: string, duration: string) {
  const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return (
    `🟢 <b>RESOLVED: Service Recovered</b>\n\n` +
    `<b>Monitor:</b> <code>${monitorName}</code>\n` +
    `<b>Target:</b> ${url}\n` +
    `<b>Downtime:</b> <code>${duration}</code>\n` +
    `<b>Time:</b> <code>${time} UTC</code>`
  );
}
