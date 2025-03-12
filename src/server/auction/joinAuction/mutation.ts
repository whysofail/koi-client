import { QueryClient, useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const joinAuction = async (token: string, auctionID: string) => {
  const { data } = await fetchWithAuth.post(
    `/auctions/${auctionID}/join`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

const useJoinAuction = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({ auctionID }: { auctionID: string }) => {
      return await joinAuction(token, auctionID);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
    },
    onError: (error) => {
      console.error("Failed to join auction:", error);
    },
  });
};

export default useJoinAuction;
