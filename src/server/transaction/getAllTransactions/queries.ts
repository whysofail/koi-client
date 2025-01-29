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

// Fetch Admin Transactions
const fetchAllTransactions = async ({
  token,
  ...params
}: FetchAllTransactionsParams): Promise<PaginatedTransactionsResponse> => {
  const queryString = buildQueryParams(params);
  const { data } = await fetchWithAuth.get(`/transactions?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Fetch User Transactions
const fetchUserTransactions = async ({
  token,
  ...params
}: FetchAllTransactionsParams): Promise<PaginatedTransactionsResponse> => {
  const queryString = buildQueryParams(params);
  const { data } = await fetchWithAuth.get(`/transactions/me?${queryString}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const useGetAllTransactions = (params: FetchAllTransactionsParams) =>
  useQuery({
    queryKey: ["allTransactions", params],
    queryFn: () => fetchAllTransactions(params),
  });

const useGetUserTransactions = (params: FetchAllTransactionsParams) =>
  useQuery({
    queryKey: ["userTransactions", params],
    queryFn: () => fetchUserTransactions(params),
  });

export { useGetAllTransactions, useGetUserTransactions };
