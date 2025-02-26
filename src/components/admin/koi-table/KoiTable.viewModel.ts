import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import useGetKoiData from "@/server/koi/getAllKois/queries";

const KoiTableViewModel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const searchColumn = {
    id: searchParams.get("searchColumn") || "code",
    label: searchParams.get("searchColumnLabel") || "Code",
  };

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

  const setSearchColumn = useCallback(
    (column: { id: string; label: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("searchColumn", column.id);
      params.set("searchColumnLabel", column.label);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const {
    data: PaginatedData,
    isLoading,
    isError,
  } = useGetKoiData({
    page: pageIndex,
    per_page: pageSize,
  });

  interface IKoiURLSearchParams {
    koiCode: string;
    nickname: string;
    gender: string;
    breeder: string;
    variety: string;
    size: string;
  }

  const addToAuctionSearchParams = (
    koiID: string,
    params: IKoiURLSearchParams,
  ) => {
    const searchParams = new URLSearchParams({
      koiCode: params.koiCode,
      nickname: params.nickname,
      gender: params.gender,
      breeder: params.breeder,
      variety: params.variety,
      size: params.size,
    });

    const url = `/dashboard/auctions/add/${koiID}?${searchParams.toString()}`;

    return url;
  };

  return {
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    searchColumn,
    setSearchColumn,
    PaginatedData,
    isLoading,
    isError,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    addToAuctionSearchParams,
  };
};

export default KoiTableViewModel;
