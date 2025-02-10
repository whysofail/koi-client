import useGetBidsByAuctionID from "@/server/bid/getBidsByAuctionID/queries";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { Auction } from "@/types/auctionTypes";
import { Bid } from "@/types/bidTypes";

export const useAuctionDetailsViewModel = (
  auctionID: string,
  token: string,
) => {
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

  const auction: Auction | undefined = auctionData?.data[0];
  const bids: Bid[] = bidsData?.data || [];

  return {
    auction,
    bids,
    isLoading: isLoadingAuction || isLoadingBids,
    error: auctionError || bidsError,
  };
};
