import useGetBidsByAuctionID from "@/server/bid/getBidsByAuctionID/queries";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { Auction } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { Socket } from "socket.io-client";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { AuctionBuyNow } from "@/types/auctionBuyNowTypes";
import useGetBuyNowByAuctionId from "@/server/auction/getAuctionBuyNowByAuctionID/queries";

export const useAuctionDetailsViewModel = (
  auctionID: string,
  token: string,
  socket?: Socket | null,
  isAdmin: boolean = false,
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

  const {
    data: buyNowData,
    isLoading: isLoadingBuyNow,
    error: buyNowError,
  } = useGetBuyNowByAuctionId({
    token,
    auction_id: auctionID,
    options: { enabled: isAdmin },
  });

  const auction: Auction | undefined = auctionData?.data[0];
  const bids: DetailedBid[] = (bidsData?.data as DetailedBid[]) || [];
  const buyNow: AuctionBuyNow[] = (buyNowData?.data as AuctionBuyNow[]) || [];

  return {
    auction,
    bids,
    buyNow,
    isLoading: isLoadingAuction || isLoadingBids || isLoadingBuyNow,
    error: auctionError || bidsError || buyNowError,
    socketStatus: {
      isConnected,
      isConnecting,
      lastReceivedAt,
    },
  };
};
