import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  PaginatedTransactionsResponse,
  FetchAllTransactionsParams,
  TransactionOrderBy,
} from "@/types/transactionTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

const buildQueryParams = ({
  page = 1,
  limit = 10,
  startDateFrom,
  startDateTo,
  status,
  orderBy = TransactionOrderBy.CREATED_AT,
  order = "DESC",
}: Omit<FetchAllTransactionsParams, "token">) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    orderBy,
    order,
  });

  if (startDateFrom) params.append("startDateFrom", formatDate(startDateFrom));
  if (startDateTo) params.append("startDateTo", formatDate(startDateTo));
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
  });
};

export { useGetTransactions };
