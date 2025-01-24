import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
  const { data: response } = await axios.post(
    `${process.env.BACKEND_URL}/api/auctions`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
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
