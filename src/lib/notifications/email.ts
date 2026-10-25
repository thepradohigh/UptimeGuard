import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.sendMail({ from: process.env.SMTP_FROM || "UptimeGuard <noreply@uptimeguard.dev>", to, subject, html });
    return true;
  } catch (error: any) {
    console.error("[Email] Failed:", error.message);
    return false;
  }
}

export function formatDownEmailHtml(name: string, url: string, code: number | null, err: string | null): string {
  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><div style="background:#fee2e2;border-left:4px solid #ef4444;padding:16px;border-radius:8px"><h2 style="color:#dc2626;margin:0">🔴 Monitor Down</h2><p style="margin:8px 0 0;color:#7f1d1d">${name} is not responding</p></div><table style="width:100%;margin-top:16px"><tr><td style="padding:8px 0;color:#6b7280">URL</td><td><code>${url}</code></td></tr><tr><td style="padding:8px 0;color:#6b7280">Status</td><td><code>${code || "N/A"}</code></td></tr>${err ? `<tr><td style="padding:8px 0;color:#6b7280">Error</td><td>${err}</td></tr>` : ""}</table></div>`;
}

export function formatUpEmailHtml(name: string, url: string, rt: number, downtime: string): string {
  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto"><div style="background:#dcfce7;border-left:4px solid #22c55e;padding:16px;border-radius:8px"><h2 style="color:#16a34a;margin:0">🟢 Monitor Recovered</h2><p style="margin:8px 0 0;color:#14532d">${name} is back online</p></div><table style="width:100%;margin-top:16px"><tr><td style="padding:8px 0;color:#6b7280">URL</td><td><code>${url}</code></td></tr><tr><td style="padding:8px 0;color:#6b7280">Response</td><td><code>${rt}ms</code></td></tr><tr><td style="padding:8px 0;color:#6b7280">Downtime</td><td><code>${downtime}</code></td></tr></table></div>`;
}