import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const monitorSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url(),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]).default("GET"),
  expectedStatus: z.number().int().min(100).max(599).default(200),
  headers: z.record(z.string()).optional().nullable(),
  body: z.string().optional().nullable(),
  interval: z.number().int().min(1).max(60).default(5),
  timeout: z.number().int().min(1).max(60).default(10),
  keyword: z.string().optional().nullable(),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  telegramChatId: z.string().optional().nullable(),
  emailNotifications: z.boolean().optional(),
  notifyCooldown: z.number().int().min(1).max(60).optional(),
});