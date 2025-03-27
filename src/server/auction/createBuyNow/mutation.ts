import { QueryClient, useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";

interface CreateBuyNowParams {
  auctionId: string;
}

const createBuyNow = async (
  token: string | null,
  { auctionId }: CreateBuyNowParams,
) => {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const { data } = await fetchWithAuth.post(
    `/auctions/${auctionId}/buynow`,
    {}, // Body should be empty if no additional data is needed
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return data;
};

export const useCreateBuyNow = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (params: CreateBuyNowParams) => createBuyNow(token, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buyNowRequests"] }); // Refresh buy now requests
      queryClient.invalidateQueries({ queryKey: ["auction"] }); // Refresh auction data
    },
    onError: (error) => {
      throw new Error(getErrorMessage(error));
    },
  });
};
