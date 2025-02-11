import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";

const deleteAuction = async (token: string, auctionId: string) => {
  const { data: response } = await fetchWithAuth.delete(
    `/auctions/${auctionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

const useDeleteAuction = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (auctionId: string) => {
      try {
        return await deleteAuction(token, auctionId);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
    },
    onError: (error) => {
      console.error("Failed to delete auction:", error);
    },
  });
};

export default useDeleteAuction;
