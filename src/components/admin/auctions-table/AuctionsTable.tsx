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
  Eye,
  MoreHorizontal,
  Trash,
  Upload,
  ExternalLink,
  Edit,
  AlertCircle,
} from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  transformAuctionToTableData,
  type AuctionTableData,
  AuctionOrderBy,
} from "@/types/auctionTypes";
import StatusBadge from "./StatusBadge";
import AuctionsTableViewModel from "./AuctionsTable.viewModel";
import { AuctionStatus } from "@/types/auctionTypes";
import AuctionDialog from "../auctions-dialog/AuctionDialog";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";
import AuctionFilters from "./AuctionFilter";
import { useSocket } from "@/hooks/use-socket";

const AuctionsTable: React.FC<{ token: string }> = ({ token }) => {
  const { adminSocket } = useSocket(token);
  const {
    orderBy,
    order,
    PaginatedData,
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
    startDateFrom,
    startDateTo,
    setStartDateFrom,
    setStartDateTo,
    pageIndex,
    status,
    setStatus,
    updateAuctionURLSearchParams,
    handleFiltersApply,
    handleResetFilters,
    handleSort,
    currentFilters,
    handlePageSizeChange,
    handleNextPage,
    handlePreviousPage,
    isError,
  } = AuctionsTableViewModel({ token: token, socket: adminSocket });

  const getSortIcon = (columnOrderBy: AuctionOrderBy) => {
    if (orderBy !== columnOrderBy)
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return order === "ASC" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const columns: ColumnDef<AuctionTableData>[] = [
    {
      accessorKey: "auction_id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(AuctionOrderBy.TITLE)}
        >
          Title
          {getSortIcon(AuctionOrderBy.TITLE)}
        </Button>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "item",
      header: "Koi ID",
    },
    {
      accessorKey: "start_datetime",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(AuctionOrderBy.START_DATETIME)}
        >
          Start Date
          {getSortIcon(AuctionOrderBy.START_DATETIME)}
        </Button>
      ),
      cell: ({ row }) => {
        if (
          ["DRAFT", "CANCELLED", "PENDING", "COMPLETED", "FAILED"].includes(
            row.original.status,
          )
        ) {
          return;
        }
        return (
          <div>
            {formatDate(
              new Date(row.getValue("start_datetime")),
              "dd-MM-yyyy HH:mm",
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "end_datetime",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(AuctionOrderBy.END_DATETIME)}
        >
          End Date
          {getSortIcon(AuctionOrderBy.END_DATETIME)}
        </Button>
      ),
      cell: ({ row }) => {
        if (
          ["DRAFT", "CANCELLED", "PENDING", "COMPLETED", "FAILED"].includes(
            row.original.status,
          )
        ) {
          return <div>-</div>;
        }
        return (
          <div>
            {formatDate(
              new Date(row.getValue("end_datetime")),
              "dd-MM-yyyy HH:mm",
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(AuctionOrderBy.STATUS)}
        >
          Status
          {getSortIcon(AuctionOrderBy.STATUS)}
        </Button>
      ),
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "current_highest_bid",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(AuctionOrderBy.CURRENT_HIGHEST_BID)}
        >
          Current Bid
          {getSortIcon(AuctionOrderBy.CURRENT_HIGHEST_BID)}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.original.current_highest_bid;
        return <div>{formatCurrency(value ?? 0)}</div>;
      },
    },
    {
      accessorKey: "reserve_price",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(AuctionOrderBy.RESERVE_PRICE)}
        >
          Reserve Price
          {getSortIcon(AuctionOrderBy.RESERVE_PRICE)}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.original.reserve_price;
        return <div>{formatCurrency(value ?? 0)}</div>;
      },
    },
    {
      accessorKey: "bid_increment",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(AuctionOrderBy.BID_INCREMENT)}
        >
          Bid Increment
          {getSortIcon(AuctionOrderBy.BID_INCREMENT)}
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.original.bid_increment;
        return <div>{formatCurrency(value ?? 0)}</div>;
      },
    },
    {
      accessorKey: "user",
      header: "Creator",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" avoidCollisions>
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/auctions/item/${row.original.auction_id}`}
              >
                <ExternalLink />
                View Details
              </Link>
            </DropdownMenuItem>
            {row.original.status === "DRAFT" && (
              <>
                <AuctionDialog
                  operation="publish"
                  bid_increment={row.original.bid_increment}
                  reserve_price={row.original.reserve_price}
                  auction_id={row.original.auction_id}
                  token={token}
                >
                  <div className="flex w-full items-center">
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Publish Auction</span>
                  </div>
                </AuctionDialog>
                <AuctionDialog
                  operation="delete"
                  auction_id={row.original.auction_id}
                  bid_increment={row.original.bid_increment}
                  reserve_price={row.original.reserve_price}
                  token={token}
                  koiId={row.original.item}
                >
                  <div className="flex w-full items-center">
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete Auction</span>
                  </div>
                </AuctionDialog>
                <DropdownMenuItem asChild>
                  <Link
                    href={updateAuctionURLSearchParams(
                      row.original.auction_id,
                      {
                        koiID: row.original.item,
                      },
                    )}
                  >
                    <Edit />
                    Update Auction
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            {row.original.status === "PUBLISHED" && (
              <AuctionDialog
                operation="unpublish"
                auction_id={row.original.auction_id}
                bid_increment={row.original.bid_increment}
                reserve_price={row.original.reserve_price}
                token={token}
              >
                <div className="flex w-full items-center">
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Unpublish Auction</span>
                </div>
              </AuctionDialog>
            )}
            {row.original.status === "STARTED" && (
              <AuctionDialog
                operation="cancel"
                auction_id={row.original.auction_id}
                koiId={row.original.item}
                bid_increment={row.original.bid_increment}
                reserve_price={row.original.reserve_price}
                token={token}
              >
                <div className="flex w-full items-center">
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Cancel Auction</span>
                </div>
              </AuctionDialog>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: PaginatedData?.data.map(transformAuctionToTableData) ?? [],
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
        auction_id: false, // Hide the auction_id column by default
        ...columnVisibility,
      },
      rowSelection,
    },
    pageCount: Math.ceil((PaginatedData?.count ?? 0) / pageSize),
    manualPagination: true,
    manualSorting: true,
  });

  const searchableColumns = [
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "user", label: "Creator" },
  ];

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AuctionFilters
            onApply={handleFiltersApply}
            onReset={handleResetFilters}
            initialFilters={currentFilters}
          />
          {/* Add status filter dropdown before the existing search dropdown */}
          <Select
            value={status || "all"}
            onValueChange={(value) =>
              setStatus(value === "all" ? undefined : (value as AuctionStatus))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(AuctionStatus).map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption.charAt(0).toUpperCase() +
                    statusOption.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Existing search and filter components */}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  Search by {searchColumn.label}{" "}
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
              onChange={(event) =>
                table
                  .getColumn(searchColumn.id)
                  ?.setFilterValue(event.target.value)
              }
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
                {startDateFrom
                  ? formatDate(startDateFrom, "dd-MM-yy")
                  : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDateFrom}
                onSelect={setStartDateFrom}
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
                {startDateTo
                  ? formatDate(startDateTo, "dd-MM-yyyy")
                  : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDateTo}
                onSelect={setStartDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns
              <Eye className="h-4 w-4" />
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
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
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
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-red-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Error loading auctions. Please try again later.</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : PaginatedData?.data?.length ? (
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
        <div className="flex-1 text-sm text-muted-foreground">
          Page {pageIndex} of{" "}
          {Math.ceil((PaginatedData?.count ?? 0) / pageSize)} | Total{" "}
          {PaginatedData?.count ?? 0} items
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
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
            onClick={handlePreviousPage}
            disabled={pageIndex === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
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

export default AuctionsTable;
