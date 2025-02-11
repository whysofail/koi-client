import { QueryClient, useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";

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
    mutationFn: async (params: PlaceBidParams) => {
      try {
        return await placeBidOnAuction(token, params);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
    },
    onError: (error) => {
      console.error("Failed to place bid on auction:", error);
    },
  });
};

export default usePlaceBid;
