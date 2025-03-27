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
      await queryClient.invalidateQueries({ queryKey: ["buyNowRequests"] });
      await queryClient.invalidateQueries({
        queryKey: ["buyNowRequest", auction_buynow_id],
      });
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

    // Optimistically update koi status
    queryClient.setQueryData(["koiData", koiId], (old: any) => ({
      ...old,
      status: KoiStatus.SOLD,
      buyer_name: buyerName,
    }));

    try {
      await updateKoiStatus({
        koiId,
        koiStatus: KoiStatus.SOLD,
        buyerName,
        sell_date: new Date().toISOString().split("T")[0],
      });

      await completeMutation.mutateAsync(auction_buynow_id);

      queryClient.invalidateQueries({ queryKey: ["buyNowRequests"] });
      queryClient.invalidateQueries({
        queryKey: ["buyNowRequest", auction_buynow_id],
      });
      queryClient.invalidateQueries({ queryKey: ["koiData", koiId] });
      queryClient.invalidateQueries({ queryKey: ["auction"] });
    } catch (error) {
      // Revert koi status if an error occurs
      queryClient.setQueryData(["koiData", koiId], previousKoi);
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
