import { useRouter } from "next/navigation";
import { useState } from "react";
import useGetTransactions from "@/server/transaction/getTransactions/queries";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { TransactionOrderBy } from "@/types/transactionTypes";
import { TransactionStatus } from "@/types/transactionTypes";
import { User } from "next-auth";

const TransactionsTableViewModel = (user: User) => {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createdAtFrom, setCreatedAtFrom] = useState<Date | undefined>();
  const [createdAtTo, setCreatedAtTo] = useState<Date | undefined>();
  const [orderBy, setOrderBy] = useState<TransactionOrderBy>(
    TransactionOrderBy.CREATED_AT,
  );
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [searchColumn, setSearchColumn] = useState<{
    id: string;
    label: string;
  }>({
    id: "amount",
    label: "Amount",
  });
  const [status, setStatus] = useState<TransactionStatus | undefined>(
    undefined,
  );

  // Common query parameters
  const queryParams = {
    token: user.accessToken,
    isAdmin: user.role === "admin",
    page: pageIndex,
    limit: pageSize,
    createdAtFrom,
    createdAtTo,
    orderBy,
    order,
    status,
  };

  const { data: PaginatedData, isLoading } = useGetTransactions(queryParams);

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
