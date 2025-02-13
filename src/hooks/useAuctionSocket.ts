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
  publicSocket: Socket | null;
  auctionId: string;
}

export const useAuctionSocket = ({
  publicSocket,
  auctionId,
}: UseAuctionSocketProps) => {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastReceivedAt, setLastReceivedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!publicSocket) return;
    setIsConnecting(true);
    publicSocket.on("connect", () => {
      setIsConnected(true);
      setIsConnecting(false);
    });
    publicSocket.on("connect_error", (err) => {
      setIsConnected(false);
      setIsConnecting(false);
      setError(err);
    });

    publicSocket.emit("joinAuction", auctionId);

    const handleUpdate = (data: SocketData) => {
      if (data.entity !== "auction") return;
      setLastReceivedAt(new Date());

      // Invalidate on Socket update
      if (data.type) {
        console.log("Invalidating queries for new bid", data);
        queryClient.invalidateQueries({
          queryKey: ["auction", auctionId],
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

    publicSocket.on("update", handleUpdate);

    return () => {
      if (publicSocket.connected) {
        publicSocket.emit("leaveAuction", auctionId);
        publicSocket.off("connect");
        publicSocket.off("connect_error");
        publicSocket.off("update", handleUpdate);
      }
    };
  }, [publicSocket, auctionId, queryClient]);
  return { isConnected, isConnecting, error, lastReceivedAt };
};
