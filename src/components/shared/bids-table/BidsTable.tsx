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
  Row,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CalendarIcon,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { format as formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { BidWithUserAndAuction } from "@/types/bidTypes";
import BidsTableViewModel, { BidOrderBy } from "./BidsTable.viewModel";
import { formatCurrency } from "@/lib/formatCurrency";

interface BidsTableProps {
  token: string;
  isAdmin: boolean;
}

const BidsTable: React.FC<BidsTableProps> = ({ token, isAdmin }) => {
  const {
    orderBy,
    order,
    PaginatedData,
    isLoading,
    pageSize,
    bidTimeFrom,
    bidTimeTo,
    setBidTimeFrom,
    setBidTimeTo,
    pageIndex,
    handleNextPage,
    handlePreviousPage,
    handlePageSizeChange,
    handleSort,
  } = BidsTableViewModel(token, isAdmin);

  const getSortIcon = (columnOrderBy: BidOrderBy) => {
    if (orderBy !== columnOrderBy)
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return order === "ASC" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const columns: ColumnDef<BidWithUserAndAuction>[] = [
    {
      accessorKey: "bid_amount",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => handleSort(BidOrderBy.BID_AMOUNT)}
        >
          Bid Amount
          {getSortIcon(BidOrderBy.BID_AMOUNT)}
        </Button>
      ),
      cell: ({ row }: { row: Row<BidWithUserAndAuction> }) =>
        formatCurrency(Number(row.getValue("bid_amount"))),
    },
    {
      accessorKey: "bid_time",
      header: () => (
        <Button variant="ghost" onClick={() => handleSort(BidOrderBy.BID_TIME)}>
          Bid Time
          {getSortIcon(BidOrderBy.BID_TIME)}
        </Button>
      ),
      cell: ({ row }: { row: Row<BidWithUserAndAuction> }) =>
        formatDate(new Date(row.getValue("bid_time")), "dd-MM-yyyy HH:mm"),
    },
    {
      accessorKey: "auction.title",
      header: "Auction Title",
      cell: ({ row }: { row: Row<BidWithUserAndAuction> }) =>
        row.original.auction.title || "-",
    },
    isAdmin && {
      accessorKey: "user.username",
      header: "Bidder",
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<BidWithUserAndAuction> }) => (
        <Button asChild variant="ghost" size="sm">
          <Link
            href={
              isAdmin
                ? `/dashboard/auctions/item/${row.original.auction.auction_id}`
                : `/auctions/${row.original.auction.auction_id}`
            }
          >
            <ExternalLink className="h-4 w-4" />
            View in Auction
          </Link>
        </Button>
      ),
    },
  ].filter(Boolean) as ColumnDef<BidWithUserAndAuction>[];

  const table = useReactTable({
    data: PaginatedData?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    pageCount: Math.ceil((PaginatedData?.count ?? 0) / pageSize),
    manualPagination: true,
    manualSorting: true,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      {isAdmin && (
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {bidTimeFrom
                  ? formatDate(bidTimeFrom, "dd-MM-yyyy")
                  : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bidTimeFrom}
                onSelect={setBidTimeFrom}
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
                {bidTimeTo ? formatDate(bidTimeTo, "dd-MM-yyyy") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={bidTimeTo}
                onSelect={setBidTimeTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="rounded-md border dark:border-neutral-700">
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
            disabled={pageIndex === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={
              pageIndex >= Math.ceil((PaginatedData?.count ?? 0) / pageSize)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BidsTable;
