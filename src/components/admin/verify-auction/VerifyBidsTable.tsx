"use client";

import React, { memo, useMemo, useState } from "react";
import { Bid } from "@/types/auctionTypes";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VerifyBidsTableProps {
  bids: Bid[];
  selectedBidId: string | undefined;
  onSelectBid: (bid: Bid) => void;
  isVerified?: boolean;
}

const VerifyBidsTable: React.FC<VerifyBidsTableProps> = memo(
  ({ bids, selectedBidId, onSelectBid, isVerified = false }) => {
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);

    const sortedBids = useMemo(() => {
      return [...(bids || [])].sort(
        (a, b) => parseFloat(b.bid_amount) - parseFloat(a.bid_amount),
      );
    }, [bids]);

    const paginatedBids = useMemo(() => {
      const start = (pageIndex - 1) * pageSize;
      const end = start + pageSize;
      return sortedBids.slice(start, end);
    }, [sortedBids, pageIndex, pageSize]);

    const handlePageSizeChange = (size: number) => {
      setPageSize(size);
      setPageIndex(1); // Reset to first page when changing page size
    };

    const handlePreviousPage = () => {
      setPageIndex((prev) => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
      setPageIndex((prev) => {
        const maxPage = Math.ceil(sortedBids.length / pageSize);
        return Math.min(maxPage, prev + 1);
      });
    };

    const highestBid = useMemo(() => {
      return sortedBids.length > 0 ? sortedBids[0] : null;
    }, [sortedBids]);

    const columns = useMemo<ColumnDef<Bid>[]>(
      () => [
        {
          id: "status",
          header: "",
          cell: ({ row }) => (
            <div className="flex items-center">
              {row.original.bid_id === highestBid?.bid_id && (
                <Trophy className="h-5 w-5 text-yellow-500" />
              )}
              {selectedBidId === row.original.bid_id && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
          ),
        },
        {
          accessorKey: "user.username",
          header: "Bidder",
          cell: ({ row }) => (
            <div className="font-medium">{row.original.user.username}</div>
          ),
        },
        {
          accessorKey: "bid_amount",
          header: "Amount",
          cell: ({ row }) => (
            <div>{formatCurrency(row.original.bid_amount)}</div>
          ),
        },
        {
          accessorKey: "bid_time",
          header: "Time",
          cell: ({ row }) => {
            try {
              return (
                <div>{format(row.original.bid_time, "dd-MM-yy HH:mm:ss")}</div>
              );
            } catch {
              return <div>{row.original.bid_time || "Invalid date"}</div>;
            }
          },
        },
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const isSelected = selectedBidId === row.original.bid_id;
            return (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectBid(row.original)}
                className={isSelected ? "bg-primary/20" : ""}
                disabled={isVerified}
              >
                {isSelected && isVerified ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Winner
                  </>
                ) : (
                  "Select as Winner"
                )}
              </Button>
            );
          },
        },
      ],
      [highestBid, onSelectBid, selectedBidId, isVerified],
    );

    const table = useReactTable({
      data: paginatedBids,
      columns,
      getCoreRowModel: getCoreRowModel(),
    });

    if (!bids || bids.length === 0) {
      return (
        <Card className="p-4 text-center text-muted-foreground">
          No bids found for this auction
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span>Highest Bidder</span>
        </div>

        <div className="rounded-md border">
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
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "hover:bg-muted/50",
                    row.original.bid_id === highestBid?.bid_id
                      ? "bg-yellow-50 dark:bg-yellow-900/20"
                      : "",
                    selectedBidId === row.original.bid_id
                      ? "bg-primary/10"
                      : "",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Page {pageIndex} of {Math.ceil(sortedBids.length / pageSize)} |
            Total {sortedBids.length} bids
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
                {[5, 10, 20, 30, 40, 50].map((size) => (
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
              disabled={pageIndex >= Math.ceil(sortedBids.length / pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

VerifyBidsTable.displayName = "VerifyBidsTable";

export default VerifyBidsTable;
