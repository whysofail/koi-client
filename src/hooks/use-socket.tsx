import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/}`, {
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log(`Connected to default namespace`);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(`Disconnected from default namespace: ${reason}`);
    });

    socketInstance.on("connect_error", (error) => {
      console.error(`Connection error: ${error.message}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
};

// Custom hook for socket with authentication
export const useSocketWithAuth = (
  namespace: string,
  token: string,
): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  useEffect(() => {
    const socketInstance = io(`${socketUrl}/${namespace}`, {
      auth: {
        token,
      },
      transports: ["websocket"],
    });

    socketInstance.on("connect", () => {
      console.log(`Connected to ${namespace} with token: ${token}`);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(`Disconnected from ${namespace}: ${reason}`);
    });

    socketInstance.on("connect_error", (error) => {
      console.error(`Connection error: ${error.message}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [namespace, socketUrl, token]);

  return socket;
};
