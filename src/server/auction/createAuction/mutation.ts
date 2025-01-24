import { useMutation } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type CreateAuctionParams = {
  title: string;
  description: string;
  item: number;
  start_datetime: Date;
  end_datetime: Date;
  reserve_price: number;
  bid_increment: number;
};

const createAuction = async (token: string, data: CreateAuctionParams) => {
  const { data: response } = await fetchWithAuth.post("/auctions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const useCreateAuction = (token: string) => {
  return useMutation({
    mutationFn: (data: CreateAuctionParams) => createAuction(token, data),
    onError: (error) => {
      console.error("Failed to create auction:", error);
    },
  });
};
