import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { entityHandlers } from "@/server/socket/handler";

const AUTH_NAMESPACE = "/auth"; // Notifications & user data
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const useSocket = (token?: string) => {
  const queryClient = useQueryClient();
  const [authSocket, setAuthSocket] = useState<Socket | null>(null);
  const [publicSocket, setPublicSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to public namespace
    const publicSocketInstance = io(`${SOCKET_URL}/`, {
      transports: ["websocket"],
    });
    setPublicSocket(publicSocketInstance);

    publicSocketInstance.on("connect", () =>
      console.log("Connected to public namespace"),
    );
    publicSocketInstance.on("update", (data) => {
      const handler = entityHandlers[data.entity];
      if (handler) handler(data, queryClient);
    });

    publicSocketInstance.on("connect_error", (err) =>
      console.error("Public connection error:", err.message),
    );

    return () => {
      publicSocketInstance.close();
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

    authSocketInstance.on("connect", () =>
      console.log("Connected to auth namespace"),
    );
    authSocketInstance.on("update", (data) => {
      const handler = entityHandlers[data.entity];
      if (handler) handler(data, queryClient);
    });

    authSocketInstance.on("connect_error", (err) => {
      console.error("Auth connection error:", err.message);
    });

    return () => {
      authSocketInstance.close();
    };
  }, [token, queryClient]);

  return { authSocket, publicSocket };
};
