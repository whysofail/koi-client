import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  FetchAllAuctionsParams,
  PaginatedAuctionsResponse,
  AuctionOrderBy,
} from "@/types/auctionTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// const dateNow = new Date();
// const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

const fetchAllAuctions = async ({
  page = 1,
  limit = 10,
  status,
  startDateFrom,
  // startDateTo,
  orderBy = AuctionOrderBy.CREATED_AT,
  order = "DESC",
  token,
}: FetchAllAuctionsParams) => {
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    // startDateTo: formatDate(startDateTo),
    orderBy,
    order,
  });

  if (status) {
    if (Array.isArray(status)) {
      status.forEach((s) => params.append("status[]", s)); // Handle multiple statuses
    } else {
      params.append("status", status);
    }
  }

  if (startDateFrom) {
    params.append("startDateFrom", formatDate(startDateFrom));
  }
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const { data } = await fetchWithAuth.get<PaginatedAuctionsResponse>(
    `/auctions?${params.toString()}`,
    { headers },
  );

  return data;
};

const useGetAllAuctions = ({ ...params }: FetchAllAuctionsParams) =>
  useQuery({
    queryKey: ["allAuctions", params],
    queryFn: () => fetchAllAuctions({ ...params }),
    placeholderData: (previousData) => previousData,
  });

export default useGetAllAuctions;
