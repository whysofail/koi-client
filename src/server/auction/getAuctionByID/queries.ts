import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuctionByIDResponse } from "@/types/auctionTypes";

const getAuctionByID = async (id: string, token: string) => {
  const { data } = await fetchWithAuth.get<AuctionByIDResponse>(
    `/auctions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

const useGetAuctionByID = (
  id: string,
  token: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["auction"],
    queryFn: () => getAuctionByID(id, token),
    enabled: options?.enabled,
  });
};

export default useGetAuctionByID;
