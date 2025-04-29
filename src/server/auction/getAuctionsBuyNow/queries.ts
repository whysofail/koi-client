import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuctionBuyNow } from "@/types/auctionBuyNowTypes";

interface FetchBuyNowRequestsParams {
  token: string;
  auction_id: string;
  page?: number;
  limit?: number;
}

const fetchBuyNowRequests = async ({
  token,
  auction_id,
}: FetchBuyNowRequestsParams) => {
  const { data } = await fetchWithAuth.get<{ data: AuctionBuyNow[] }>(
    `/auctions/${auction_id}/buynow`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data.data;
};

const useGetBuyNowRequests = ({
  token,
  auction_id,
}: FetchBuyNowRequestsParams) =>
  useQuery({
    queryKey: ["buyNowRequests", auction_id],
    queryFn: () => fetchBuyNowRequests({ token, auction_id }),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

export default useGetBuyNowRequests;
