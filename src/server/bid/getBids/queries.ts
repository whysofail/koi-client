import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  PaginatedBidsResponse,
  LoggedInUserBidsResponse,
} from "@/types/bidTypes";

const dateNow = new Date();
const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

interface FetchBidsParams {
  token: string;
  isAdmin: boolean;
  page?: number;
  limit?: number;
  bidAmountMin?: number;
  bidAmountMax?: number;
  bidTimeFrom?: Date;
  bidTimeTo?: Date;
  orderBy?: string;
  order?: "ASC" | "DESC";
}

const fetchBids = async ({
  token,
  isAdmin,
  page = 1,
  limit = 10,
  bidAmountMin,
  bidAmountMax,
  bidTimeFrom,
  bidTimeTo = nextWeek,
  orderBy = "createdAt",
  order = "DESC",
}: FetchBidsParams) => {
  if (!isAdmin) {
    const { data } = await fetchWithAuth.get<LoggedInUserBidsResponse>(
      "/bids/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return data;
  }

  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    bidTimeTo: formatDate(bidTimeTo),
    orderBy,
    order,
  });

  if (bidAmountMin) {
    params.append("bidAmountMin", bidAmountMin.toString());
  }

  if (bidAmountMax) {
    params.append("bidAmountMax", bidAmountMax.toString());
  }

  if (bidTimeFrom) {
    params.append("bidTimeFrom", formatDate(bidTimeFrom));
  }

  const { data } = await fetchWithAuth.get<PaginatedBidsResponse>(
    `/bids?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetBids = ({ token, isAdmin, ...params }: FetchBidsParams) =>
  useQuery({
    queryKey: ["bids", isAdmin, params],
    queryFn: () => fetchBids({ token, isAdmin, ...params }),
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

export default useGetBids;
