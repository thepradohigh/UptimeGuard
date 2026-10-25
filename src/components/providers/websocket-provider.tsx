"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-provider";

interface WSContextType {
  isConnected: boolean;
  subscribe: (event: string, handler: (data: any) => void) => () => void;
}

const WSContext = createContext<WSContextType>({ isConnected: false, subscribe: () => () => {} });

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { tokens, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const handlersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  useEffect(() => {
    if (!isAuthenticated || !tokens?.accessToken) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";
    const socket = io(wsUrl, {
      auth: { token: tokens.accessToken },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (err) => console.error("[WS]", err.message));
    socket.onAny((event: string, data: any) => {
      const handlers = handlersRef.current.get(event);
      if (handlers) handlers.forEach((h) => h(data));
    });

    socketRef.current = socket;
    return () => { socket.disconnect(); socketRef.current = null; setIsConnected(false); };
  }, [isAuthenticated, tokens?.accessToken]);

  const subscribe = (event: string, handler: (data: any) => void) => {
    if (!handlersRef.current.has(event)) handlersRef.current.set(event, new Set());
    handlersRef.current.get(event)!.add(handler);
    return () => {
      const handlers = handlersRef.current.get(event);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) handlersRef.current.delete(event);
      }
    };
  };

  return <WSContext.Provider value={{ isConnected, subscribe }}>{children}</WSContext.Provider>;
}

export function useWebSocket() { return useContext(WSContext); }