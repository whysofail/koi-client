import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { UpdateAuctionBody } from "@/types/auctionTypes";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/handleApiError";

const updateAuction = async (
  token: string,
  auctionId: string,
  data: UpdateAuctionBody,
) => {
  const { data: response } = await fetchWithAuth.put(
    `/auctions/${auctionId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};

export const useUpdateAuction = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({
      auctionId,
      data,
    }: {
      auctionId: string;
      data: UpdateAuctionBody;
    }) => {
      try {
        return await updateAuction(token, auctionId, data);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
    },
    onError: (error) => {
      console.error("Failed to update auction:", error);
    },
  });
};
