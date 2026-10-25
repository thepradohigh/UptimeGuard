import cron from "node-cron";
import { runChecks } from "./checker";
import prisma from "./prisma";

let isRunning = false;

export function startCronJobs(): void {
  cron.schedule("*/30 * * * * *", async () => {
    if (isRunning) return;
    isRunning = true;
    try { await runChecks(); } catch (err: any) { console.error("[Cron]", err.message); } finally { isRunning = false; }
  });

  cron.schedule("0 3 * * *", async () => {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      const result = await prisma.check.deleteMany({ where: { createdAt: { lt: cutoff } } });
      console.log(`[Cleanup] Deleted ${result.count} old checks`);
    } catch (err: any) { console.error("[Cleanup]", err.message); }
  });

  console.log("Cron jobs started");
}