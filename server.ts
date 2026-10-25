import { createServer } from "http";
import next from "next";
import { initWebSocket } from "./src/lib/websocket";
import { startCronJobs } from "./src/lib/cron";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
const wsPort = parseInt(process.env.WS_PORT || "3001", 10);

async function main() {
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();
  await app.prepare();

  const nextServer = createServer((req, res) => { handle(req, res); });
  nextServer.listen(port, hostname, () => {
    console.log(`Next.js ready on http://${hostname}:${port}`);
  });

  const wsServer = createServer();
  initWebSocket(wsServer);
  wsServer.listen(wsPort, hostname, () => {
    console.log(`WebSocket server on ws://${hostname}:${wsPort}`);
  });

  startCronJobs();
}

main().catch((err) => { console.error("Fatal error:", err); process.exit(1); });