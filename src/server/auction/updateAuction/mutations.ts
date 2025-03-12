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
    onMutate: async ({ auctionId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["allAuctions"] });

      const previousAuctions = queryClient.getQueryData(["allAuctions"]);

      queryClient.setQueryData(["allAuctions"], (old: any[] = []) =>
        old.map((auction) =>
          auction.auction_id === auctionId ? { ...auction, ...data } : auction,
        ),
      );

      return { previousAuctions };
    },
    onError: (_, __, context) => {
      if (context?.previousAuctions) {
        queryClient.setQueryData(["allAuctions"], context.previousAuctions);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
    },
  });
};
