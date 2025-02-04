import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  PaginatedTransactionsResponse,
  FetchAllTransactionsParams,
  TransactionOrderBy,
} from "@/types/transactionTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const dateNow = new Date();
const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

const buildQueryParams = ({
  page = 1,
  limit = 10,
  createdAtFrom,
  createdAtTo = nextWeek,
  status,
  orderBy = TransactionOrderBy.CREATED_AT,
  order = "DESC",
}: Omit<FetchAllTransactionsParams, "token">) => {
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    createdAtTo: formatDate(createdAtTo),
    orderBy,
    order,
  });

  if (createdAtFrom) params.append("createdAtFrom", formatDate(createdAtFrom));

  if (status) params.append("status", status);

  return params.toString();
};

const fetchTransactions = async ({
  token,
  isAdmin,
  ...params
}: FetchAllTransactionsParams & {
  isAdmin: boolean;
}): Promise<PaginatedTransactionsResponse> => {
  const queryString = buildQueryParams(params);
  const endpoint = isAdmin ? "/transactions" : "/transactions/me";

  const { data } = await fetchWithAuth.get(`${endpoint}?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const useGetTransactions = (
  params: FetchAllTransactionsParams & { isAdmin: boolean },
) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => fetchTransactions(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export default useGetTransactions;
