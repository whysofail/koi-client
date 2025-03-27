import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuctionBuyNow } from "@/types/auctionBuyNowTypes";

interface FetchBuyNowRequestsParams {
  token: string;
  auction_id?: string; // Marked as optional to handle undefined cases
  options?: { enabled?: boolean };
}

interface BuyNowResponse {
  data: AuctionBuyNow[];
}

const fetchBuyNowRequests = async ({
  token,
  auction_id,
}: FetchBuyNowRequestsParams) => {
  if (!auction_id) throw new Error("Auction ID is required");

  const { data } = await fetchWithAuth.get<BuyNowResponse>(
    `/auctions/${auction_id}/buynow`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return data;
};

const useGetBuyNowByAuctionId = ({
  token,
  auction_id,
  options,
}: FetchBuyNowRequestsParams) =>
  useQuery({
    queryKey: ["buyNowRequests", auction_id],
    queryFn: () => fetchBuyNowRequests({ token, auction_id }),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: options?.enabled,
  });

export default useGetBuyNowByAuctionId;
