import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";

const completeBuyNow = async (token: string, auction_buynow_id: string) => {
  const { data: response } = await fetchWithAuth.put(
    `/auctions/buynow/complete/`,
    { auction_buynow_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

const useCompleteBuyNow = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (auction_buynow_id: string) => {
      try {
        return await completeBuyNow(token, auction_buynow_id);
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
      console.error("Failed to complete Buy Now:", error);
    },
  });
};

export default useCompleteBuyNow;
