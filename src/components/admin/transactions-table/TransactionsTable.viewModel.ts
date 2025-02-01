import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { format } from "date-fns";
import useGetTransactions from "@/server/transaction/getTransactions/queries";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  TransactionOrderBy,
  TransactionStatus,
} from "@/types/transactionTypes";
import { User } from "next-auth";

const TransactionsTableViewModel = (user: User) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-managed states
  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const createdAtFrom = searchParams.get("createdAtFrom")
    ? new Date(searchParams.get("createdAtFrom")!)
    : undefined;
  const createdAtTo = searchParams.get("createdAtTo")
    ? new Date(searchParams.get("createdAtTo")!)
    : undefined;
  const orderBy =
    (searchParams.get("orderBy") as TransactionOrderBy) ||
    TransactionOrderBy.CREATED_AT;
  const order = (searchParams.get("order") as "ASC" | "DESC") || "DESC";
  const searchColumn = {
    id: searchParams.get("searchColumn") || "amount",
    label: searchParams.get("searchColumnLabel") || "Amount",
  };
  const status = searchParams.get("status") as TransactionStatus | undefined;

  // Table-specific states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const setPageIndex = useCallback(
    (page: number) => {
      router.push(`?${createQueryString("page", page.toString())}`);
    },
    [createQueryString, router],
  );

  const setPageSize = useCallback(
    (limit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", limit.toString());
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const setCreatedAtFrom = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString("createdAtFrom", format(date, "yyyy-MM-dd"))}`,
        );
      }
    },
    [createQueryString, router],
  );

  const setCreatedAtTo = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString("createdAtTo", format(date, "yyyy-MM-dd"))}`,
        );
      }
    },
    [createQueryString, router],
  );

  const setOrderBy = useCallback(
    (newOrderBy: TransactionOrderBy) => {
      router.push(`?${createQueryString("orderBy", newOrderBy)}`);
    },
    [createQueryString, router],
  );

  const setOrder = useCallback(
    (newOrder: "ASC" | "DESC") => {
      router.push(`?${createQueryString("order", newOrder)}`);
    },
    [createQueryString, router],
  );

  const setSearchColumn = useCallback(
    (column: { id: string; label: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("searchColumn", column.id);
      params.set("searchColumnLabel", column.label);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const setStatus = useCallback(
    (newStatus?: TransactionStatus) => {
      if (newStatus) {
        router.push(`?${createQueryString("status", newStatus)}`);
      } else {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("status");
        router.push(`?${params.toString()}`);
      }
    },
    [createQueryString, router, searchParams],
  );

  const { data: PaginatedData, isLoading } = useGetTransactions({
    token: user.accessToken,
    isAdmin: user.role === "admin",
    page: pageIndex,
    limit: pageSize,
    createdAtFrom,
    createdAtTo,
    orderBy,
    order,
    status,
  });

  return {
    router,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    createdAtFrom,
    setCreatedAtFrom,
    createdAtTo,
    setCreatedAtTo,
    orderBy,
    setOrderBy,
    order,
    setOrder,
    searchColumn,
    setSearchColumn,
    PaginatedData,
    isLoading,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    status,
    setStatus,
  };
};

export default TransactionsTableViewModel;
