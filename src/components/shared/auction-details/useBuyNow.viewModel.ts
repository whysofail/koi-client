import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCompleteBuyNow from "@/server/auction/AuctionBuyNow/mutation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";

const cancelBuyNow = async (token: string, auction_buynow_id: string) => {
  const { data: response } = await fetchWithAuth.put(
    `/auctions/buynow/cancel/`,
    { auction_buynow_id }, // ✅ Corrected the body parameter
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const useBuyNowViewModel = (token: string) => {
  const queryClient = useQueryClient();

  // Use the updated completeBuyNow mutation
  const completeMutation = useCompleteBuyNow(token, queryClient);

  const cancelMutation = useMutation({
    mutationFn: async (auction_buynow_id: string) => {
      try {
        return await cancelBuyNow(token, auction_buynow_id);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async (_, __, auction_buynow_id) => {
      await queryClient.invalidateQueries({ queryKey: ["buyNowRequests"] });
      await queryClient.invalidateQueries({
        queryKey: ["buyNowRequest", auction_buynow_id],
      });
    },
    onError: (error) => {
      console.error("Failed to cancel Buy Now:", error);
    },
  });

  return {
    completeBuyNow: completeMutation.mutate,
    isCompleting: completeMutation.isPending,
    cancelBuyNow: cancelMutation.mutate,
    isCanceling: cancelMutation.isPending,
  };
};
