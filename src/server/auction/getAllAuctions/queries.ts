import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  FetchAllAuctionsParams,
  PaginatedAuctionsResponse,
  AuctionOrderBy,
} from "@/types/auctionTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const dateNow = new Date();
const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

const fetchAllAuctions = async ({
  token,
  page = 1,
  limit = 10,
  status,
  startDateFrom,
  startDateTo = nextWeek,
  orderBy = AuctionOrderBy.CREATED_AT,
  order = "DESC",
}: FetchAllAuctionsParams) => {
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    startDateTo: formatDate(startDateTo),
    orderBy,
    order,
  });

  if (status) {
    params.append("status", status);
  }

  if (startDateFrom) {
    params.append("startDateFrom", formatDate(startDateFrom));
  }

  const { data } = await fetchWithAuth.get<PaginatedAuctionsResponse>(
    `/auctions?${params.toString()}`,
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
    queryKey: ["allAuctions", params],
    queryFn: () => fetchAllAuctions({ token, ...params }),
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

export default useGetAllAuctions;
