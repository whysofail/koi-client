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
  orderBy?:
    | "auction_id"
    | "title"
    | "description"
    | "item"
    | "start_datetime"
    | "end_datetime"
    | "status"
    | "current_highest_bid"
    | "reserve_price"
    | "bid_increment"
    | "created_at"
    | "updated_at"
    | "created_by_id";
  order?: "ASC" | "DESC";
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
  orderBy = "created_at",
  order = "DESC",
}: FetchAllAuctionsParams): Promise<PaginatedAuctionsResponse> => {
  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const { data } = await fetchWithAuth.get(
    `/auctions?page=${page}&limit=${limit}&status=${status}&startDateFrom=${formatDate(startDateFrom)}&startDateTo=${formatDate(startDateTo)}&orderBy=${orderBy}&order=${order}`,
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
