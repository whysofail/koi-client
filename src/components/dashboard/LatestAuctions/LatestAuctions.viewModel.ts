import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";

const useLatestAuctionsViewModel = (token: string) => {
  const { data: auctionsData, isLoading } = useGetAllAuctions({
    token,
    status: AuctionStatus.STARTED,
    limit: 3,
    orderBy: AuctionOrderBy.CREATED_AT,
    order: "DESC",
  });

  return {
    auctions: auctionsData?.data ?? [],
    isLoading,
    isEmpty: !auctionsData?.data?.length,
  };
};

export default useLatestAuctionsViewModel;
