import { QueryClient, useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface PlaceBidParams {
  auctionID: string;
  bid_amount: number;
}

const placeBidOnAuction = async (
  token: string,
  { auctionID, bid_amount }: PlaceBidParams,
) => {
  const { data } = await fetchWithAuth.post(
    `/bids/auction/${auctionID}`,
    { bid_amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

const usePlaceBid = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (params: PlaceBidParams) => placeBidOnAuction(token, params),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
    },
    onError: (error) => {
      console.error("Failed to place bid on auction:", error);
    },
  });
};

export default usePlaceBid;
