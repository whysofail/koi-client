import { useQuery } from "@tanstack/react-query";
import { GetAuctionByIDResponse } from "@/types/auctionTypes";
import axios from "axios";

const fetchAuctionByID = async (
  id: string,
  token: string,
): Promise<GetAuctionByIDResponse> => {
  const { data } = await axios.get(
    `${process.env.BACKEND_URL}/api/auctions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetAuctionByID = (id: string, token: string) =>
  useQuery({
    queryKey: ["auctionByID", id],
    queryFn: () => fetchAuctionByID(id, token),
  });

export default useGetAuctionByID;
