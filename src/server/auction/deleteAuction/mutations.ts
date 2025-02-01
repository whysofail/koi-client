import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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
    mutationFn: (auctionId: string) => deleteAuction(token, auctionId),
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
    },
    onError: (error) => {
      console.error("Failed to delete auction:", error);
    },
  });
};

export default useDeleteAuction;
