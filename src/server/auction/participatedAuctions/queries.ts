import { useQuery } from "@tanstack/react-query";
import { FetchAllAuctionsParams } from "@/types/auctionTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { JoinedAuctionParticipantResponse } from "@/types/auctionParticipantTypes";

const fetchJoinedAuctions = async ({
  token,
  page = 1,
  limit = 10,
}: FetchAllAuctionsParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  const { data } = await fetchWithAuth.get<JoinedAuctionParticipantResponse>(
    `/auctions/participated?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetJoinedAuctions = ({ token, ...params }: FetchAllAuctionsParams) =>
  useQuery({
    queryKey: ["joinedAuctions", params],
    queryFn: () => fetchJoinedAuctions({ token, ...params }),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

export default useGetJoinedAuctions;
