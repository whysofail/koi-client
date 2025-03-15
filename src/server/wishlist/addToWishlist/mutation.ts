import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";

const addWishlist = async (token: string, auctionId: string) => {
  const { data: response } = await fetchWithAuth.post(
    `/wishlists/${auctionId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

const useAddWishlist = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({ auctionId }: { auctionId: string }) => {
      try {
        return await addWishlist(token, auctionId);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async (_, __, { auctionId }) => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      await queryClient.invalidateQueries({
        queryKey: ["wishlist", auctionId],
      });
      await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
    },
    onError: (error) => {
      console.error("Failed to update wishlist:", error);
    },
  });
};

export default useAddWishlist;
