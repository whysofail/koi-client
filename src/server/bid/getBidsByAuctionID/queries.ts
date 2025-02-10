import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { BidByIDResponse } from "@/types/bidTypes";

const fetchBidsByAuctionID = async (auctionID: string, token: string) => {
  const { data } = await fetchWithAuth.get<BidByIDResponse>(
    `/bids/auction/${auctionID}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetBidsByAuctionID = (
  auctionID: string,
  token: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["bidsByID", auctionID],
    queryFn: () => fetchBidsByAuctionID(auctionID, token),
    enabled: options?.enabled,
  });
};

export default useGetBidsByAuctionID;
