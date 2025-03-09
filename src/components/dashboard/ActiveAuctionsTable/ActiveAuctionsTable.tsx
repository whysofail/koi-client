"use client";

import React, { FC } from "react";
import Link from "next/link";
import { ExternalLink, AlertCircle, PackageX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
import ActiveAuctionsViewModel from "./ActiveAuctionsTable.viewModel";
import ActiveAuctionTableSkeleton from "../../skeletons/ActiveAuctionTableSkeleton";

interface Props {
  token: string;
}

const ActiveAuctionsTable: FC<Props> = ({ token }) => {
  const {
    ActiveAuctionsData,
    formatTimeRemaining,
    formatCurrency,
    isLoading,
    isError,
  } = ActiveAuctionsViewModel(token, 5, AuctionOrderBy.CREATED_AT);

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Current Bid</TableHead>
            <TableHead className="text-center">Participants</TableHead>
            <TableHead className="text-center">Bids</TableHead>
            <TableHead>Time Remaining</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <ActiveAuctionTableSkeleton />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center">
                <div className="flex flex-col items-center gap-2 text-destructive">
                  <AlertCircle className="h-8 w-8" />
                  <p>Failed to load auctions. Please try again later.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : ActiveAuctionsData?.length ? (
            ActiveAuctionsData?.map((auction) => (
              <TableRow key={auction.auction_id}>
                <TableCell className="max-w-[200px] truncate font-medium">
                  <Link
                    href={`/dashboard/auctions/item/${auction.auction_id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    {auction.title}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </TableCell>
                <TableCell>
                  {formatCurrency(Number(auction.current_highest_bid))}
                </TableCell>
                <TableCell className="text-center">
                  {auction.participants.length}
                </TableCell>
                <TableCell className="text-center">
                  {auction.bids.length}
                </TableCell>
                <TableCell key={Date.now()}>
                  {formatTimeRemaining(auction.end_datetime)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={auction.status as AuctionStatus} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <PackageX className="h-8 w-8" />
                  <p>No active auctions found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActiveAuctionsTable;
