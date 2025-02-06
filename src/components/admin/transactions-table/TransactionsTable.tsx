"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Eye,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format as formatDate } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import {
  transformTransactionToTableData,
  type TransactionTableData,
  TransactionOrderBy,
} from "@/types/transactionTypes";
import StatusBadge from "./StatusBadge";
import TransactionsTableViewModel from "./TransactionsTable.viewModel";
import { TransactionStatus } from "@/types/transactionTypes";
import TypeBadge from "./TypeBadge";
import { Session } from "next-auth";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatCurrency } from "@/lib/formatCurrency";
import TransactionFilters from "./TransactionFilter";

const TransactionsTable: React.FC<{ user: Session["user"] }> = ({ user }) => {
  const {
    router,
    orderBy,
    order,
    handleSort,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setRowSelection,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    isLoading,
    pageSize,
    searchColumn,
    setSearchColumn,
    setCreatedAtFrom,
    createdAtFrom,
    setCreatedAtTo,
    createdAtTo,
    setPageIndex,
    pageIndex,
    setPageSize,
    status,
    setStatus,
    PaginatedData,
    handleFiltersApply,
    handleResetFilters,
    currentFilters,
  } = TransactionsTableViewModel(user);

  const getSortIcon = (columnOrderBy: TransactionOrderBy) => {
    if (orderBy !== columnOrderBy)
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return order === "ASC" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const columns: ColumnDef<TransactionTableData>[] = [
    {
      accessorKey: "transaction_id",
      header: "ID",
    },
    {
      accessorKey: "type",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(TransactionOrderBy.TYPE)}
        >
          Type
          {getSortIcon(TransactionOrderBy.TYPE)}
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          <TypeBadge type={row.getValue("type")} />
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(TransactionOrderBy.AMOUNT)}
        >
          Amount
          {getSortIcon(TransactionOrderBy.AMOUNT)}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.original.amount;
        return <div>{formatCurrency(value ?? 0)}</div>;
      },
    },
    {
      accessorKey: "user",
      header: "Sender",
    },
    {
      accessorKey: "created_at",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(TransactionOrderBy.CREATED_AT)}
        >
          Date
          {getSortIcon(TransactionOrderBy.CREATED_AT)}
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {formatDate(
            new Date(row.getValue("created_at")),
            "dd/MM/yyyy : hh:mm a",
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(TransactionOrderBy.STATUS)}
        >
          Status
          {getSortIcon(TransactionOrderBy.STATUS)}
        </Button>
      ),
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/dashboard/transactions/${row.original.transaction_id}`,
                )
              }
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: PaginatedData?.data.map(transformTransactionToTableData) ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: {
        transaction_id: false, // Hide the transaction_id column by default
        ...columnVisibility,
      },
      rowSelection,
    },
    pageCount: Math.ceil((PaginatedData?.count ?? 0) / pageSize),
    manualPagination: true,
    manualSorting: true, // Add this
  });

  const searchableColumns = [
    { id: "amount", label: "Amount" },
    { id: "user", label: "Sender" },
  ];

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TransactionFilters
            onApply={handleFiltersApply}
            onReset={handleResetFilters}
            initialFilters={currentFilters}
          />

          <Select
            value={status || "all"}
            onValueChange={(value) =>
              setStatus(
                value === "all" ? undefined : (value as TransactionStatus),
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(TransactionStatus).map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption.charAt(0).toUpperCase() +
                    statusOption.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  Search by {searchColumn.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {searchableColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={searchColumn.id === column.id}
                    onCheckedChange={() => setSearchColumn(column)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              placeholder={`Search by ${searchColumn.label}...`}
              value={
                (table
                  .getColumn(searchColumn.id)
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                // Update the filter value in the table state
                const value = event.target.value;
                table.getColumn(searchColumn.id)?.setFilterValue(value);

                // Optionally update the column filter state
                setColumnFilters((oldFilters) => [
                  ...oldFilters.filter(
                    (filter) => filter.id !== searchColumn.id,
                  ),
                  { id: searchColumn.id, value },
                ]);
              }}
              className="max-w-sm"
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {createdAtFrom
                  ? formatDate(createdAtFrom, "dd-MM-yyyy")
                  : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={createdAtFrom}
                onSelect={setCreatedAtFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {createdAtTo
                  ? formatDate(createdAtTo, "dd-MM-yyyy")
                  : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={createdAtTo}
                onSelect={setCreatedAtTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <Eye className="h-4 w-4" />
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative rounded-md border dark:border-neutral-700">
        {isLoading && (
          <div className="bg-background/50 absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {PaginatedData?.data?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          Page {pageIndex} of{" "}
          {Math.ceil((PaginatedData?.count ?? 0) / pageSize)} | Total{" "}
          {PaginatedData?.count ?? 0} items
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageIndex(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={
              pageIndex >= Math.ceil((PaginatedData?.count ?? 0) / pageSize) ||
              isLoading
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
