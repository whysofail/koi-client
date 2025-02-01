import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";
import { format } from "date-fns";

const AuctionsTableViewModel = (token: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const startDateFrom = searchParams.get("startDateFrom")
    ? new Date(searchParams.get("startDateFrom")!)
    : undefined;
  const startDateTo = searchParams.get("startDateTo")
    ? new Date(searchParams.get("startDateTo")!)
    : undefined;
  const orderBy =
    (searchParams.get("orderBy") as AuctionOrderBy) ||
    AuctionOrderBy.CREATED_AT;
  const order = (searchParams.get("order") as "ASC" | "DESC") || "DESC";
  const searchColumn = {
    id: searchParams.get("searchColumn") || "title",
    label: searchParams.get("searchColumnLabel") || "Title",
  };
  const status = searchParams.get("status") as AuctionStatus | undefined;

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

  const setStartDateFrom = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString("startDateFrom", format(date, "yyyy-MM-dd"))}`,
        );
      }
    },
    [createQueryString, router],
  );

  const setStartDateTo = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString("startDateTo", format(date, "yyyy-MM-dd"))}`,
        );
      }
    },
    [createQueryString, router],
  );

  const setOrderBy = useCallback(
    (newOrderBy: AuctionOrderBy) => {
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
    (newStatus?: AuctionStatus) => {
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

  const { data: PaginatedData, isLoading } = useGetAllAuctions({
    token,
    page: pageIndex,
    limit: pageSize,
    startDateFrom,
    startDateTo,
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
    startDateFrom,
    setStartDateFrom,
    startDateTo,
    setStartDateTo,
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

export default AuctionsTableViewModel;
