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
  TransactionType,
  TransactionFilters,
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

  const searchColumn = {
    id: searchParams.get("searchColumn") || "amount",
    label: searchParams.get("searchColumnLabel") || "Amount",
  };
  const status = searchParams.get("status") as TransactionStatus | undefined;
  const type = searchParams.get("type") as TransactionType | undefined;
  const orderBy =
    (searchParams.get("orderBy") as TransactionOrderBy) ||
    TransactionOrderBy.CREATED_AT;
  const order = (searchParams.get("order") as "ASC" | "DESC") || "DESC";

  // Table-specific states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params.toString();
    },
    [searchParams],
  );

  const handleFiltersApply = useCallback(
    (filters: TransactionFilters) => {
      const queryParams = Object.entries({
        status: filters.status,
        type: filters.type,
        createdAtFrom: filters.createdAtFrom,
        createdAtTo: filters.createdAtTo,
        orderBy: filters.orderBy,
        order: filters.order,
      }).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      const queryString = createQueryString(queryParams);

      if (queryString) {
        router.push(`?${queryString}`);
      }
    },
    [createQueryString, router],
  );

  const setStatus = useCallback(
    (status: TransactionStatus) => {
      router.push(`?${createQueryString({ status })}`);
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

  const setCreatedAtFrom = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString({
            createdAtFrom: format(date, "yyyy-MM-dd"),
          })}`,
        );
      }
    },
    [createQueryString, router],
  );

  const setCreatedAtTo = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString({
            createdAtTo: format(date, "yyyy-MM-dd"),
          })}`,
        );
      }
    },
    [createQueryString, router],
  );

  const setPageIndex = useCallback(
    (page: number) => {
      router.push(`?${createQueryString({ page: page.toString() })}`);
    },
    [createQueryString, router],
  );

  const setPageSize = useCallback(
    (limit: number) => {
      router.push(
        `?${createQueryString({ limit: limit.toString(), page: "1" })}`,
      );
    },
    [createQueryString, router],
  );

  const handleSort = useCallback(
    (newOrderBy: TransactionOrderBy) => {
      const currentOrder = searchParams.get("order") as "ASC" | "DESC";
      const newOrder = currentOrder === "ASC" ? "DESC" : "ASC";

      router.push(
        `?${createQueryString({
          orderBy: newOrderBy,
          order: newOrder,
        })}`,
      );
    },
    [searchParams, createQueryString, router],
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
    orderBy,
    order,
    handleSort,
    searchColumn,
    PaginatedData,
    isLoading,
    sorting,
    setSearchColumn,
    setCreatedAtFrom,
    createdAtFrom,
    createdAtTo,
    setCreatedAtTo,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    status,
    setStatus,
    handleFiltersApply,
    currentFilters: {
      status,
      type,
      createdAtFrom: createdAtFrom?.toISOString().split("T")[0],
      createdAtTo: createdAtTo?.toISOString().split("T")[0],
      orderBy,
      order,
    } as TransactionFilters,
  };
};

export default TransactionsTableViewModel;
