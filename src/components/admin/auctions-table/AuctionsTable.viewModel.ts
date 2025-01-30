import { useRouter } from "next/navigation";
import { useState } from "react";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { AuctionOrderBy } from "@/types/auctionTypes";
import { AuctionStatus } from "@/types/auctionTypes";

const AuctionsTableViewModel = (token: string) => {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDateFrom, setStartDateFrom] = useState<Date | undefined>();
  const [startDateTo, setStartDateTo] = useState<Date | undefined>();
  const [orderBy, setOrderBy] = useState<AuctionOrderBy>(
    AuctionOrderBy.CREATED_AT,
  );
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [searchColumn, setSearchColumn] = useState<{
    id: string;
    label: string;
  }>({
    id: "title",
    label: "Title",
  });
  const [status, setStatus] = useState<AuctionStatus | undefined>(undefined);

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

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
