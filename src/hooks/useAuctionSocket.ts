import { useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { Auction } from "@/types/auctionTypes";

interface SocketData {
  entity: string;
  type: string;
  data: Auction;
}
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
  lastUpdate: Auction | null;
}

export const useAuctionSocket = ({
  socket,
  auctionId,
}: UseAuctionSocketProps): UseAuctionSocketReturn => {
  const [users, setUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Auction | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !auctionId) return;

    const handleUserListUpdate = (updatedUsers: string[]) => {
      console.log("Received user list update:", updatedUsers);
      setUsers(updatedUsers);
    };

    const handleAuctionUpdate = (data: SocketData) => {
      if (data.entity === "auction" && data.data.auction_id === auctionId) {
        console.log("Received auction update:", data);
        setLastUpdate(data.data);
        queryClient.invalidateQueries({ queryKey: ["auctions", auctionId] });

        // If update includes bid data, invalidate bids query
        if (data.data.bids) {
          queryClient.invalidateQueries({
            queryKey: ["auctions", auctionId, "bids"],
          });
        }
      }
    };

    const handleSuccess = (message: string) => {
      console.log("Socket success:", message);
      setIsConnected(true);
    };

    const handleError = (error: Error) => {
      console.error("Socket error:", error);
      setIsConnected(false);
    };

    // Set up event listeners
    socket.on("userListUpdate", handleUserListUpdate);
    socket.on("update", handleAuctionUpdate);
    socket.on("success", handleSuccess);
    socket.on("connect_error", handleError);
    socket.on("disconnect", () => setIsConnected(false));

    // Join auction room
    socket.emit("joinAuction", auctionId);
    console.log("Joining auction room:", auctionId);

    // Cleanup
    return () => {
      socket.off("userListUpdate", handleUserListUpdate);
      socket.off("update", handleAuctionUpdate);
      socket.off("success", handleSuccess);
      socket.off("connect_error", handleError);
      socket.emit("leaveAuction", auctionId);
      console.log("Leaving auction room:", auctionId);
    };
  }, [socket, auctionId, queryClient]);

  const joinAuction = useCallback(
    (roomId: string) => {
      if (!socket) return;
      console.log("Manually joining auction:", roomId);
      socket.emit("joinAuction", roomId);
    },
    [socket],
  );

  const leaveAuction = useCallback(
    (roomId: string) => {
      if (!socket) return;
      console.log("Manually leaving auction:", roomId);
      socket.emit("leaveAuction", roomId);
    },
    [socket],
  );

  const getUsers = useCallback(
    (roomId: string) => {
      if (!socket) return;
      console.log("Requesting users for auction:", roomId);
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
    lastUpdate,
  };
};
