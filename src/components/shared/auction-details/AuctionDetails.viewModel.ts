import useGetBidsByAuctionID from "@/server/bid/getBidsByAuctionID/queries";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { Auction } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { Socket } from "socket.io-client";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import React from "react";

export const useAuctionDetailsViewModel = (
  auctionID: string,
  token: string,
  socket?: Socket | null,
) => {
  const { isConnected, isConnecting, lastReceivedAt } = useAuctionSocket({
    socket: socket ?? null,
    auctionId: auctionID,
  });

  const {
    data: auctionData,
    isLoading: isLoadingAuction,
    error: auctionError,
  } = useGetAuctionByID(auctionID, token, {
    enabled: !!token && !!auctionID,
  });

  const {
    data: bidsData,
    isLoading: isLoadingBids,
    error: bidsError,
  } = useGetBidsByAuctionID(auctionID, token, {
    enabled: !!token && !!auctionID,
  });

  // Add debug log for bid updates
  React.useEffect(() => {
    if (bidsData?.data) {
      console.log("Bids data updated:", {
        time: new Date().toISOString(),
        count: bidsData.data.length,
        latest: bidsData.data[0],
      });
    }
  }, [bidsData]);

  const auction: Auction | undefined = auctionData?.data[0];
  const bids: DetailedBid[] = (bidsData?.data as DetailedBid[]) || [];

  return {
    auction,
    bids,
    isLoading: isLoadingAuction || isLoadingBids,
    error: auctionError || bidsError,
    socketStatus: {
      isConnected,
      isConnecting,
      lastReceivedAt,
    },
  };
};
