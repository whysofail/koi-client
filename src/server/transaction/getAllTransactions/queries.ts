import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  PaginatedTransactionsResponse,
  FetchAllTransactionsParams,
  TransactionOrderBy,
} from "@/types/transactionTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// const dateNow = new Date();
// const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

const fetchAllTransactions = async ({
  token,
  page = 1,
  limit = 10,
  startDateFrom,
  startDateTo,
  status,
  orderBy = TransactionOrderBy.CREATED_AT,
  order = "DESC",
}: FetchAllTransactionsParams): Promise<PaginatedTransactionsResponse> => {
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    orderBy,
    order,
  });

  if (startDateFrom) {
    params.append("startDateFrom", formatDate(startDateFrom));
  }

  if (startDateTo) {
    params.append("startDateTo", formatDate(startDateTo));
  }

  if (status) {
    params.append("status", status);
  }

  const { data } = await fetchWithAuth.get(
    `/transactions?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetAllTransactions = ({
  token,
  ...params
}: FetchAllTransactionsParams) =>
  useQuery({
    queryKey: ["allTransactions", params, token],
    queryFn: () => fetchAllTransactions({ token, ...params }),
  });

export default useGetAllTransactions;
