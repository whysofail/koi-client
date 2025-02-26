import { useSession } from "next-auth/react";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";

const useLatestAuctionsViewModel = () => {
  const { data: session } = useSession();
  const { data: auctionsData, isLoading } = useGetAllAuctions({
    token: session?.user?.accessToken ?? "",
    status: AuctionStatus.PUBLISHED,
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
