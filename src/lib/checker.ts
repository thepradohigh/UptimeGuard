import axios, { AxiosError } from "axios";
import { MonitorStatus, Prisma } from "@prisma/client";
import prisma from "./prisma";
import { notifyDown, notifyUp } from "./notifications";
import { getWebSocketServer } from "./websocket";

interface CheckResult {
  status: MonitorStatus;
  statusCode: number | null;
  responseTime: number | null;
  errorMessage: string | null;
}

async function performCheck(monitor: any): Promise<CheckResult> {
  const startTime = Date.now();
  try {
    const headers: Record<string, string> = {};
    if (monitor.headers && typeof monitor.headers === "object" && !Array.isArray(monitor.headers)) {
      Object.assign(headers, monitor.headers);
    }

    const response = await axios({
      method: monitor.method.toLowerCase() as any,
      url: monitor.url,
      headers,
      data: monitor.body || undefined,
      timeout: monitor.timeout * 1000,
      validateStatus: () => true,
      maxRedirects: 5,
    });

    const responseTime = Date.now() - startTime;
    const statusCode = response.status;

    if (statusCode !== monitor.expectedStatus) {
      return { status: MonitorStatus.DOWN, statusCode, responseTime, errorMessage: `Expected ${monitor.expectedStatus}, got ${statusCode}` };
    }

    if (monitor.keyword) {
      const bodyText = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      if (!bodyText.includes(monitor.keyword)) {
        return { status: MonitorStatus.DOWN, statusCode, responseTime, errorMessage: `Keyword "${monitor.keyword}" not found` };
      }
    }

    return { status: MonitorStatus.UP, statusCode, responseTime, errorMessage: null };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return { status: MonitorStatus.TIMEOUT, statusCode: null, responseTime, errorMessage: `Timeout after ${monitor.timeout}s` };
    }
    return { status: MonitorStatus.DOWN, statusCode: (error as AxiosError)?.response?.status ?? null, responseTime, errorMessage: error.message || "Unknown error" };
  }
}

export async function checkMonitor(monitorId: string): Promise<void> {
  const monitor = await prisma.monitor.findUnique({ where: { id: monitorId }, include: { user: true } });
  if (!monitor || !monitor.isActive) return;

  const result = await performCheck(monitor);
  const previousStatus = monitor.lastStatus;
  const statusChanged = previousStatus !== result.status && previousStatus !== MonitorStatus.UNKNOWN;

  await prisma.check.create({
    data: { monitorId: monitor.id, status: result.status, statusCode: result.statusCode, responseTime: result.responseTime, errorMessage: result.errorMessage },
  });

  await prisma.monitor.update({
    where: { id: monitor.id },
    data: { lastStatus: result.status, lastCheckedAt: new Date() },
  });

  if (statusChanged) {
    if (result.status === MonitorStatus.DOWN || result.status === MonitorStatus.TIMEOUT) {
      await prisma.incident.create({
        data: { monitorId: monitor.id, cause: result.errorMessage || "Service unreachable", lastError: result.errorMessage },
      });
      await notifyDown({ monitorId: monitor.id, monitorName: monitor.name, url: monitor.url, statusCode: result.statusCode, errorMessage: result.errorMessage });
    } else if (result.status === MonitorStatus.UP) {
      const openIncident = await prisma.incident.findFirst({ where: { monitorId: monitor.id, resolvedAt: null }, orderBy: { startedAt: "desc" } });
      if (openIncident) {
        const duration = Math.floor((Date.now() - openIncident.startedAt.getTime()) / 1000);
        await prisma.incident.update({ where: { id: openIncident.id }, data: { resolvedAt: new Date(), duration } });
      }
      await notifyUp({ monitorId: monitor.id, monitorName: monitor.name, url: monitor.url, responseTime: result.responseTime || 0 });
    }
  }

  if (result.status !== MonitorStatus.UP) {
    await prisma.incident.updateMany({ where: { monitorId: monitor.id, resolvedAt: null }, data: { lastError: result.errorMessage } });
  }

  try {
    const io = getWebSocketServer();
    if (io) {
      io.to(`user:${monitor.userId}`).emit("monitor:update", {
        monitorId: monitor.id,
        status: result.status,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
        lastCheckedAt: new Date().toISOString(),
        statusChanged,
      });
    }
  } catch {}
}

export async function runChecks(): Promise<void> {
  const now = new Date();
  const monitors = await prisma.monitor.findMany({
    where: { isActive: true },
    select: { id: true, interval: true, lastCheckedAt: true },
  });

  const due = monitors.filter((m) => {
    if (!m.lastCheckedAt) return true;
    return (now.getTime() - m.lastCheckedAt.getTime()) / 60000 >= m.interval;
  });

  if (due.length === 0) return;
  console.log(`[Checker] Running ${due.length} checks`);

  const pLimit = (await import("p-limit")).default;
  const limit = pLimit(10);

  await Promise.allSettled(due.map((m) => limit(async () => {
    try { await checkMonitor(m.id); } catch (err: any) { console.error(`[Checker] Error ${m.id}:`, err.message); }
  })));
}