import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'prisma', 'settings.json');

export interface AppSettings {
  telegramBotToken?: string;
  telegramChatId?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
  notificationEmail?: string;
}

export function getSettings(): AppSettings {
  const envDefaults: AppSettings = {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
    telegramChatId: process.env.TELEGRAM_CHAT_ID || '',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '465',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || '',
    notificationEmail: process.env.NOTIFICATION_EMAIL || '',
  };

  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const fileData = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(fileData);
      return { ...envDefaults, ...parsed };
    }
  } catch (err) {
    console.error('Error reading settings.json', err);
  }

  return envDefaults;
}

export function saveSettings(newSettings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...newSettings };

  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');

    // Обновляем процесс в реальном времени
    if (updated.telegramBotToken) process.env.TELEGRAM_BOT_TOKEN = updated.telegramBotToken;
    if (updated.telegramChatId) process.env.TELEGRAM_CHAT_ID = updated.telegramChatId;
    if (updated.smtpHost) process.env.SMTP_HOST = updated.smtpHost;
    if (updated.smtpPort) process.env.SMTP_PORT = updated.smtpPort;
    if (updated.smtpUser) process.env.SMTP_USER = updated.smtpUser;
    if (updated.smtpPass) process.env.SMTP_PASS = updated.smtpPass;
    if (updated.smtpFrom) process.env.SMTP_FROM = updated.smtpFrom;
    if (updated.notificationEmail) process.env.NOTIFICATION_EMAIL = updated.notificationEmail;
  } catch (err) {
    console.error('Error writing settings.json', err);
  }

  return updated;
}
