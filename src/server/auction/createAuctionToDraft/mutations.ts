import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuctionBody } from "@/types/auctionTypes";

const createAuctionDraft = async (token: string, data: AuctionBody) => {
  const { data: response } = await fetchWithAuth.post("/auctions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const useCreateAuctionDraft = (token: string) => {
  return useMutation({
    mutationFn: (data: AuctionBody) => createAuctionDraft(token, data),
    onError: (error) => {
      console.error("Failed to create auction:", error);
    },
  });
};
