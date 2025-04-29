import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCompleteBuyNow from "@/server/auction/CompleteAuctionBuyNow/mutation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";
import useUpdateKoi from "@/server/koi/updateKoi/mutations";
import { KoiStatus } from "@/types/koiTypes";

const cancelBuyNow = async (token: string, auction_buynow_id: string) => {
  const { data: response } = await fetchWithAuth.put(
    `/auctions/buynow/cancel/`,
    { auction_buynow_id },
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
  const completeMutation = useCompleteBuyNow(token, queryClient);
  const { mutateAsync: updateKoiStatus } = useUpdateKoi(queryClient);

  const cancelMutation = useMutation({
    mutationFn: async (auction_buynow_id: string) => {
      try {
        return await cancelBuyNow(token, auction_buynow_id);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async (_, __, auction_buynow_id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["buyNowRequests"] }),
        queryClient.invalidateQueries({
          queryKey: ["buyNowRequest", auction_buynow_id],
        }),
      ]);
    },
    onError: (error) => {
      console.error("Failed to cancel Buy Now:", error);
    },
  });

  const acceptBuyNow = async (
    auction_buynow_id: string,
    koiId: string,
    buyerName: string,
  ) => {
    const previousKoi = queryClient.getQueryData(["koiData", koiId]);
    const now = new Date();

    const sellDate = now.toISOString().split("T")[0];

    // Optimistic Update: Assume success and update UI
    queryClient.setQueryData(["koiData", koiId], (old: any) => ({
      ...old,
      status: KoiStatus.SOLD,
      buyer_name: buyerName,
      sell_date: sellDate,
    }));

    try {
      // Step 1: Update koi status
      await updateKoiStatus({
        koiId,
        koiStatus: KoiStatus.SOLD,
        buyerName,
        sell_date: sellDate,
      });

      // Step 2: Complete the Buy Now request
      await completeMutation.mutateAsync(auction_buynow_id);

      // Step 3: Invalidate queries to refresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["buyNowRequests"] }),
        queryClient.invalidateQueries({
          queryKey: ["buyNowRequest", auction_buynow_id],
        }),
        queryClient.invalidateQueries({ queryKey: ["koiData", koiId] }),
        queryClient.invalidateQueries({ queryKey: ["auction"] }),
      ]);
    } catch (error) {
      // Rollback koi status if any step fails
      queryClient.setQueryData(["koiData", koiId], previousKoi);
      console.error("Transaction failed, reverting changes:", error);
      throw new Error(getErrorMessage(error));
    }
  };

  return {
    completeBuyNow: acceptBuyNow,
    isCompleting: completeMutation.isPending,
    cancelBuyNow: cancelMutation.mutate,
    isCanceling: cancelMutation.isPending,
  };
};
