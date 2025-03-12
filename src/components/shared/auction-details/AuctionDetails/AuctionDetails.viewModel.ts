import useGetBidsByAuctionID from "@/server/bid/getBidsByAuctionID/queries";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { Auction } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { Socket } from "socket.io-client";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";

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
    enabled: true,
  });

  const {
    data: bidsData,
    isLoading: isLoadingBids,
    error: bidsError,
  } = useGetBidsByAuctionID(auctionID, token, {
    enabled: true,
  });

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
