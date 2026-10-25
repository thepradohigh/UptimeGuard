import axios from "axios";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function sendTelegramMessage(chatId: string, message: string): Promise<boolean> {
  if (!TOKEN || !chatId) return false;
  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
    return true;
  } catch (error: any) {
    console.error("[Telegram] Failed:", error?.response?.data || error.message);
    return false;
  }
}

export function formatDownAlert(name: string, url: string, code: number | null, err: string | null): string {
  const time = new Date().toLocaleString("ru-RU");
  return [
    "🔴 <b>MONITOR DOWN</b>",
    "",
    `<b>${name}</b>`,
    `URL: <code>${url}</code>`,
    code ? `Status: <code>${code}</code>` : "Status: <code>No response</code>",
    err ? `Error: ${err}` : "",
    "",
    `🕐 ${time}`,
  ].filter(Boolean).join("\n");
}

export function formatUpAlert(name: string, url: string, rt: number, downtime: string): string {
  const time = new Date().toLocaleString("ru-RU");
  return [
    "🟢 <b>MONITOR RECOVERED</b>",
    "",
    `<b>${name}</b>`,
    `URL: <code>${url}</code>`,
    `Response: <code>${rt}ms</code>`,
    `Downtime: <code>${downtime}</code>`,
    "",
    `🕐 ${time}`,
  ].join("\n");
}