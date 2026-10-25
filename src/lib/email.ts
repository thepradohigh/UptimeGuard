import nodemailer from 'nodemailer';

export async function sendEmailNotification(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || 'alerts@uptimeguard.dev';

  if (!host || !user || !pass) {
    console.warn('⚠️ [SMTP] Переменные SMTP_HOST, SMTP_USER, SMTP_PASS не настроены в .env');
    return { success: false, error: 'SMTP не настроен в .env' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true для 465, false для остальных портов
      auth: { user, pass },
    });

    console.log(`📧 [SMTP] Отправка Email на ${to}...`);

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log(`✅ [SMTP] Письмо успешно отправлено! MessageID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ [SMTP Error]:', error?.message || error);
    return { success: false, error: error?.message || 'Ошибка отправки почты' };
  }
}

// HTML-шаблон для сбоя (DOWN)
export function formatDownEmailHtml(monitorName: string, url: string, reason: string) {
  const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #0A0A0A; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; margin: 0;">
        <div style="max-width: 560px; margin: 0 auto; border: 1px solid #222222; border-radius: 12px; background-color: #111111; overflow: hidden;">
          <div style="padding: 24px; border-bottom: 1px solid #222222;">
            <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; color: #EF4444; font-weight: bold;">🔴 Incident Alert</span>
            <h2 style="font-size: 20px; margin: 8px 0 0 0; color: #FFFFFF; font-weight: 600;">${monitorName} is DOWN</h2>
          </div>
          <div style="padding: 24px; font-size: 14px; line-height: 1.6; color: #A1A1AA;">
            <p style="margin: 0 0 16px 0;">Target service is unreachable or returning error status.</p>
            <div style="background-color: #000000; border: 1px solid #222222; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #FFFFFF; margin-bottom: 20px;">
              <div style="margin-bottom: 8px;"><span style="color: #666666;">Target:</span> ${url}</div>
              <div style="margin-bottom: 8px;"><span style="color: #666666;">Reason:</span> <span style="color: #EF4444;">${reason}</span></div>
              <div><span style="color: #666666;">Timestamp:</span> ${time} UTC</div>
            </div>
          </div>
          <div style="padding: 16px 24px; background-color: #0A0A0A; border-top: 1px solid #222222; text-align: right; font-size: 12px; color: #666666; font-family: monospace;">
            UptimeGuard Infrastructure Monitoring
          </div>
        </div>
      </body>
    </html>
  `;
}

// HTML-шаблон для восстановления (UP)
export function formatUpEmailHtml(monitorName: string, url: string, duration: string) {
  const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
  return `
    <!DOCTYPE html>
    <html>
      <body style="background-color: #0A0A0A; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; margin: 0;">
        <div style="max-width: 560px; margin: 0 auto; border: 1px solid #222222; border-radius: 12px; background-color: #111111; overflow: hidden;">
          <div style="padding: 24px; border-bottom: 1px solid #222222;">
            <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; color: #D4FF4F; font-weight: bold;">🟢 Service Recovered</span>
            <h2 style="font-size: 20px; margin: 8px 0 0 0; color: #FFFFFF; font-weight: 600;">${monitorName} is back UP</h2>
          </div>
          <div style="padding: 24px; font-size: 14px; line-height: 1.6; color: #A1A1AA;">
            <p style="margin: 0 0 16px 0;">Target service has recovered and passed health checks.</p>
            <div style="background-color: #000000; border: 1px solid #222222; border-radius: 8px; padding: 16px; font-family: monospace; font-size: 13px; color: #FFFFFF; margin-bottom: 20px;">
              <div style="margin-bottom: 8px;"><span style="color: #666666;">Target:</span> ${url}</div>
              <div style="margin-bottom: 8px;"><span style="color: #666666;">Downtime:</span> <span style="color: #D4FF4F;">${duration}</span></div>
              <div><span style="color: #666666;">Timestamp:</span> ${time} UTC</div>
            </div>
          </div>
          <div style="padding: 16px 24px; background-color: #0A0A0A; border-top: 1px solid #222222; text-align: right; font-size: 12px; color: #666666; font-family: monospace;">
            UptimeGuard Infrastructure Monitoring
          </div>
        </div>
      </body>
    </html>
  `;
}
