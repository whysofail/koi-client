import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { entityHandlers } from "@/server/socket/handler";

const AUTH_NAMESPACE = "/auth"; // Notifications & user data
const ADMIN_NAMESPACE = "/admin"; // Notifications & user data

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface SocketData {
  entity: string;
  type: string;
  data: any;
}

export const useSocket = (token?: string) => {
  const queryClient = useQueryClient();
  const [authSocket, setAuthSocket] = useState<Socket | null>(null);
  const [adminSocket, setAdminSocket] = useState<Socket | null>(null);
  const [publicSocket, setPublicSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to public namespace
    const publicSocketInstance = io(`${SOCKET_URL}/`, {
      transports: ["websocket"],
    });
    setPublicSocket(publicSocketInstance);

    publicSocketInstance.on("connect", () => {
      console.log("Connected to public namespace");
    });

    // Handle entity updates (auctions, etc.)
    publicSocketInstance.on("update", (data: SocketData) => {
      const handler = entityHandlers[data.entity];
      if (handler) handler(data, queryClient);
    });

    publicSocketInstance.on("success", (message: string) => {
      console.log("Socket success:", message);
    });

    publicSocketInstance.on("connect_error", (err) => {
      console.log("Public connection error:", err.message);
    });

    return () => {
      if (publicSocketInstance) {
        // Leave any auction rooms before disconnecting
        publicSocketInstance.emit("leaveAuction", "all");
        publicSocketInstance.close();
      }
    };
  }, [queryClient]);

  useEffect(() => {
    if (!token) return; // Skip auth connection if no token

    // Connect to auth namespace
    const authSocketInstance = io(`${SOCKET_URL}${AUTH_NAMESPACE}`, {
      transports: ["websocket"],
      auth: { token },
    });

    setAuthSocket(authSocketInstance);

    authSocketInstance.on("connect", () => {
      console.log("Connected to auth namespace");
    });

    authSocketInstance.on("update", (data: SocketData) => {
      const handler = entityHandlers[data.entity];
      if (handler) handler(data, queryClient);
    });

    authSocketInstance.on("connect_error", (err) => {
      console.log("Auth connection error:", err.message);
    });

    return () => {
      if (authSocketInstance) {
        authSocketInstance.close();
      }
    };
  }, [token, queryClient]);

  useEffect(() => {
    if (!token) return; // Skip auth connection if no token

    // Connect to auth namespace
    const adminSocketInstance = io(`${SOCKET_URL}${ADMIN_NAMESPACE}`, {
      transports: ["websocket"],
      auth: { token },
    });

    setAdminSocket(adminSocketInstance);

    adminSocketInstance.on("connect", () => {
      console.log("Connected to admin namespace");
    });

    adminSocketInstance.on("update", (data: SocketData) => {
      const handler = entityHandlers[data.entity];
      if (handler) handler(data, queryClient);
    });

    adminSocketInstance.on("connect_error", (err) => {
      console.log("Auth connection error:", err.message);
    });

    return () => {
      if (adminSocketInstance) {
        adminSocketInstance.close();
      }
    };
  }, [token, queryClient]);

  return { authSocket, publicSocket, adminSocket };
};
