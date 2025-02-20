import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { Auction } from "@/types/auctionTypes";

type AuctionSocketType =
  | "PARTICIPANT_JOINED"
  | "BID_PLACED"
  | "STATUS_CHANGED"
  | "AUCTION_UPDATED";

interface SocketData {
  entity: "auction";
  type: AuctionSocketType;
  data: Auction;
}
interface UseAuctionSocketProps {
  socket: Socket | null;
  auctionId?: string;
}

export const useAuctionSocket = ({
  socket,
  auctionId,
}: UseAuctionSocketProps) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastReceivedAt, setLastReceivedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!socket) return;
    setIsConnecting(true);
    socket.on("connect", () => {
      console.log("Connected to auction socket");
      setIsConnected(true);
      setIsConnecting(false);
    });
    socket.on("connect_error", (err) => {
      setIsConnected(false);
      setIsConnecting(false);
      setError(err);
    });
    console.log(auctionId);
    socket.emit("joinAuction", auctionId);

    const handleUpdate = (data: SocketData) => {
      console.log("Received update", data);
      if (data.entity !== "auction") return;
      setLastReceivedAt(new Date());

      // Invalidate on Socket update
      if (data.type) {
        console.log("Invalidating queries for auctions", data);
        queryClient.invalidateQueries({
          queryKey: ["auction", auctionId || data.data.auction_id],
        });
        queryClient.invalidateQueries({
          queryKey: ["allAuctions"],
        });
      }

      queryClient.setQueryData<Auction>(
        ["auction", data.data.auction_id],
        (oldData) => {
          if (!oldData) return data.data;
          switch (data.type) {
            case "PARTICIPANT_JOINED":
              return {
                ...oldData,
                participants: Array.isArray(oldData.participants)
                  ? [...oldData.participants, ...data.data.participants]
                  : [data.data.participants],
              };
            case "BID_PLACED":
              return {
                ...oldData,
                current_highest_bid: data.data.current_highest_bid,
                bids: data.data.bids, // Replace with new bids data
              };
            case "STATUS_CHANGED":
              return {
                ...oldData,
                status: data.data.status,
              };
            case "AUCTION_UPDATED":
              return data.data;
            default:
              return oldData;
          }
        },
      );
    };

    socket.on("update", handleUpdate);

    return () => {
      if (socket.connected) {
        socket.emit("leaveAuction", auctionId);
        socket.off("connect");
        socket.off("connect_error");
        socket.off("update", handleUpdate);
      }
    };
  }, [socket, auctionId, queryClient]);
  return { isConnected, isConnecting, error, lastReceivedAt };
};
