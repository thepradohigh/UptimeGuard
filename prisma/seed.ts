import { PrismaClient, HttpMethod, MonitorStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  const passwordHash = await bcrypt.hash("demo123456", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@uptimeguard.dev" },
    update: {},
    create: {
      email: "demo@uptimeguard.dev",
      passwordHash,
      name: "Demo User",
      emailNotifications: true,
    },
  });

  const existing = await prisma.monitor.findMany({ where: { userId: user.id } });
  if (existing.length === 0) {
    const monitors = [
      { name: "Google", url: "https://www.google.com", method: HttpMethod.GET, expectedStatus: 200, interval: 5, timeout: 10 },
      { name: "GitHub API", url: "https://api.github.com", method: HttpMethod.GET, expectedStatus: 200, interval: 5, timeout: 15 },
      { name: "JSONPlaceholder", url: "https://jsonplaceholder.typicode.com/posts/1", method: HttpMethod.GET, expectedStatus: 200, interval: 1, timeout: 10 },
    ];
    for (const m of monitors) {
      await prisma.monitor.create({
        data: { ...m, userId: user.id, lastStatus: MonitorStatus.UNKNOWN },
      });
    }
  }

  console.log("Seed completed");
  console.log("Demo: demo@uptimeguard.dev / demo123456");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });