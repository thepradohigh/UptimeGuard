export type MonitorStatus = "UP" | "DOWN" | "TIMEOUT" | "UNKNOWN";

export interface User {
  id: string;
  email: string;
  name: string;
  telegramChatId: string | null;
  emailNotifications: boolean;
  notifyCooldown: number;
  maxMonitors: number;
  createdAt: string;
}

export interface Monitor {
  id: string;
  userId: string;
  name: string;
  url: string;
  method: string;
  expectedStatus: number;
  headers: Record<string, string> | null;
  body: string | null;
  interval: number;
  timeout: number;
  keyword: string | null;
  isActive: boolean;
  lastStatus: MonitorStatus;
  lastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
  uptime24h?: number;
  avgResponseTime?: number;
}

export interface Check {
  id: string;
  monitorId: string;
  status: MonitorStatus;
  statusCode: number | null;
  responseTime: number | null;
  errorMessage: string | null;
  createdAt: string;
}

export interface Incident {
  id: string;
  monitorId: string;
  startedAt: string;
  resolvedAt: string | null;
  duration: number | null;
  cause: string | null;
  lastError: string | null;
  monitor?: { name: string; url: string; };
}

export interface MonitorStats {
  uptime24h: number;
  uptime7d: number;
  uptime30d: number;
  avgResponseTime: number;
  totalChecks: number;
  totalIncidents: number;
  currentStreak: number;
}

export interface DashboardStats {
  totalMonitors: number;
  monitorsUp: number;
  monitorsDown: number;
  overallUptime: number;
  activeIncidents: number;
  avgResponseTime: number;
}

export interface AuthTokens { accessToken: string; refreshToken: string; }
export interface ApiResponse<T = any> { data?: T; error?: string; message?: string; }