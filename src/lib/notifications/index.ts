import { sendTelegramMessage, formatDownAlert, formatUpAlert } from "./telegram";
import { sendEmail, formatDownEmailHtml, formatUpEmailHtml } from "./email";
import prisma from "../prisma";
import { formatDuration } from "../utils";

export async function notifyDown(params: { monitorId: string; monitorName: string; url: string; statusCode: number | null; errorMessage: string | null; }) {
  const monitor = await prisma.monitor.findUnique({ where: { id: params.monitorId }, include: { user: true } });
  if (!monitor) return;

  if (monitor.lastNotifiedAt) {
    const cooldownMs = (monitor.user.notifyCooldown || 5) * 60 * 1000;
    if (Date.now() - monitor.lastNotifiedAt.getTime() < cooldownMs) return;
  }

  await prisma.monitor.update({ where: { id: params.monitorId }, data: { lastNotifiedAt: new Date() } });

  if (monitor.user.telegramChatId) {
    await sendTelegramMessage(monitor.user.telegramChatId, formatDownAlert(params.monitorName, params.url, params.statusCode, params.errorMessage));
  }
  if (monitor.user.emailNotifications && monitor.user.email) {
    await sendEmail(monitor.user.email, `🔴 ${params.monitorName} is down`, formatDownEmailHtml(params.monitorName, params.url, params.statusCode, params.errorMessage));
  }
}

export async function notifyUp(params: { monitorId: string; monitorName: string; url: string; responseTime: number; }) {
  const monitor = await prisma.monitor.findUnique({ where: { id: params.monitorId }, include: { user: true } });
  if (!monitor) return;

  const incident = await prisma.incident.findFirst({ where: { monitorId: params.monitorId, resolvedAt: null }, orderBy: { startedAt: "desc" } });
  const downtime = incident ? formatDuration(Math.floor((Date.now() - incident.startedAt.getTime()) / 1000)) : "unknown";

  if (monitor.user.telegramChatId) {
    await sendTelegramMessage(monitor.user.telegramChatId, formatUpAlert(params.monitorName, params.url, params.responseTime, downtime));
  }
  if (monitor.user.emailNotifications && monitor.user.email) {
    await sendEmail(monitor.user.email, `🟢 ${params.monitorName} recovered`, formatUpEmailHtml(params.monitorName, params.url, params.responseTime, downtime));
  }
}