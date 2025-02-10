import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import useGetBids from "@/server/bid/getBids/queries";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

export enum BidOrderBy {
  BID_AMOUNT = "bidAmount",
  BID_TIME = "bidTime",
  CREATED_AT = "createdAt",
}

const BidsTableViewModel = (token: string, isAdmin: boolean) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const bidTimeFrom = searchParams.get("bidTimeFrom")
    ? new Date(searchParams.get("bidTimeFrom")!)
    : undefined;
  const bidTimeTo = searchParams.get("bidTimeTo")
    ? new Date(searchParams.get("bidTimeTo")!)
    : undefined;
  const orderBy =
    (searchParams.get("orderBy") as BidOrderBy) || BidOrderBy.BID_TIME;
  const order = (searchParams.get("order") as "ASC" | "DESC") || "DESC";
  const bidAmountMin = Number(searchParams.get("bidAmountMin")) || undefined;
  const bidAmountMax = Number(searchParams.get("bidAmountMax")) || undefined;

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

  const setBidTimeFrom = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(`?${createQueryString("bidTimeFrom", date.toISOString())}`);
      }
    },
    [createQueryString, router],
  );

  const setBidTimeTo = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(`?${createQueryString("bidTimeTo", date.toISOString())}`);
      }
    },
    [createQueryString, router],
  );

  const handleSort = useCallback(
    (newOrderBy: BidOrderBy) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentOrderBy = params.get("orderBy") as BidOrderBy;
      const currentOrder = params.get("order") as "ASC" | "DESC";

      if (newOrderBy === currentOrderBy) {
        params.set("order", currentOrder === "ASC" ? "DESC" : "ASC");
      } else {
        params.set("orderBy", newOrderBy);
        params.set("order", "DESC");
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const { data: PaginatedData, isLoading } = useGetBids({
    token,
    isAdmin,
    page: pageIndex,
    limit: pageSize,
    bidTimeFrom,
    bidTimeTo,
    orderBy,
    order,
    bidAmountMin,
    bidAmountMax,
  });

  return {
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    bidTimeFrom,
    setBidTimeFrom,
    bidTimeTo,
    setBidTimeTo,
    orderBy,
    order,
    handleSort,
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
  };
};

export default BidsTableViewModel;
