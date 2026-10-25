import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyAccessToken } from "./jwt";

let io: SocketIOServer | null = null;

export function initWebSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token || typeof token !== "string") return next(new Error("Auth required"));
    try {
      const payload = verifyAccessToken(token);
      (socket as any).userId = payload.userId;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = (socket as any).userId;
    console.log(`[WS] User ${userId} connected`);
    socket.join(`user:${userId}`);
    socket.on("disconnect", () => console.log(`[WS] User ${userId} disconnected`));
  });

  console.log("WebSocket initialized");
  return io;
}

export function getWebSocketServer(): SocketIOServer | null { return io; }