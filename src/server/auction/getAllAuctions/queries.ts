import { useQuery } from "@tanstack/react-query";
import { PaginatedAuctionsResponse } from "@/types/auctionTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

enum AuctionStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  FAILED = "FAILED",
}

interface FetchAllAuctionsParams {
  token: string;
  page?: number;
  limit?: number;
  status?: AuctionStatus;
  startDateFrom?: Date;
  startDateTo?: Date;
}

const dateNow = new Date();
const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

const fetchAllAuctions = async ({
  token,
  page = 1,
  limit = 10,
  status = AuctionStatus.ACTIVE,
  startDateFrom = dateNow,
  startDateTo = nextWeek,
}: FetchAllAuctionsParams): Promise<PaginatedAuctionsResponse> => {
  const { data } = await fetchWithAuth.get(
    `/auctions?page=${page}&limit=${limit}&status=${status}&startDateFrom=${startDateFrom}&startDateTo=${startDateTo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetAllAuctions = ({ token, ...params }: FetchAllAuctionsParams) =>
  useQuery({
    queryKey: ["allAuctions", params, token],
    queryFn: () => fetchAllAuctions({ token, ...params }),
  });

export default useGetAllAuctions;
