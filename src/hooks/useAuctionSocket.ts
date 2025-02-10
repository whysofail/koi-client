import { useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

interface UseAuctionSocketProps {
  socket: Socket | null;
  auctionId?: string;
}

interface UseAuctionSocketReturn {
  users: string[];
  isConnected: boolean;
  joinAuction: (auctionId: string) => void;
  leaveAuction: (auctionId: string) => void;
  getUsers: (auctionId: string) => void;
}

export const useAuctionSocket = ({
  socket,
  auctionId,
}: UseAuctionSocketProps): UseAuctionSocketReturn => {
  const [users, setUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  // Handle user list updates
  useEffect(() => {
    if (!socket) return;

    const handleUserListUpdate = (updatedUsers: string[]) => {
      setUsers(updatedUsers);
    };

    const handleSuccess = (message: string) => {
      console.log("Socket success:", message);
      setIsConnected(true);
    };

    socket.on("userListUpdate", handleUserListUpdate);
    socket.on("success", handleSuccess);
    socket.on("usersInAuction", handleUserListUpdate);

    // Auto-join auction if auctionId is provided
    if (auctionId) {
      socket.emit("joinAuction", auctionId);
    }

    return () => {
      socket.off("userListUpdate", handleUserListUpdate);
      socket.off("success", handleSuccess);
      socket.off("usersInAuction", handleUserListUpdate);

      // Auto-leave auction on cleanup if we were in one
      if (auctionId) {
        socket.emit("leaveAuction", auctionId);
      }
    };
  }, [socket, auctionId, queryClient]);

  // Handle socket disconnection
  useEffect(() => {
    if (!socket) return;

    const handleDisconnect = () => {
      setIsConnected(false);
      setUsers([]);
    };

    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  // Join auction room
  const joinAuction = useCallback(
    (roomId: string) => {
      if (!socket) return;
      socket.emit("joinAuction", roomId);
    },
    [socket],
  );

  // Leave auction room
  const leaveAuction = useCallback(
    (roomId: string) => {
      if (!socket) return;
      socket.emit("leaveAuction", roomId);
    },
    [socket],
  );

  // Get users in auction
  const getUsers = useCallback(
    (roomId: string) => {
      if (!socket) return;
      socket.emit("getUsersInAuction", roomId);
    },
    [socket],
  );

  return {
    users,
    isConnected,
    joinAuction,
    leaveAuction,
    getUsers,
  };
};
