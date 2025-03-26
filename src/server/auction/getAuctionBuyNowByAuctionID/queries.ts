import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuctionBuyNow } from "@/types/auctionBuyNowTypes";

interface FetchBuyNowRequestsParams {
  token: string;
  auction_id?: string; // Marked as optional to handle undefined cases
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
}: FetchBuyNowRequestsParams) =>
  useQuery({
    queryKey: ["buyNowRequests", auction_id],
    queryFn: () => fetchBuyNowRequests({ token, auction_id }),
    enabled: !!auction_id, // Ensures the query runs only when auction_id is available
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

export default useGetBuyNowByAuctionId;
