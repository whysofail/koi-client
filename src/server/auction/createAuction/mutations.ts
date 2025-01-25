import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuctionBody } from "@/types/auctionTypes";

const createAuction = async (token: string, data: AuctionBody) => {
  const { data: response } = await fetchWithAuth.post("/auctions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const useCreateAuction = (token: string) => {
  return useMutation({
    mutationFn: (data: AuctionBody) => createAuction(token, data),
    onError: (error) => {
      console.error("Failed to create auction:", error);
    },
  });
};
