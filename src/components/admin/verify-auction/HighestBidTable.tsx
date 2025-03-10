"use client";

import React from "react";
import { Bid } from "@/types/auctionTypes";
import { formatCurrency } from "@/lib/formatCurrency";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface HighestBidTableProps {
  highestBid: Bid | null;
}

export const HighestBidTable: React.FC<HighestBidTableProps> = ({
  highestBid,
}) => {
  if (!highestBid) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No bids found for this auction
      </Card>
    );
  }

  // Format date safely
  const formatDateSafe = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd-MM-yy HH:mm:ss");
    } catch {
      return dateString || "Invalid date";
    }
  };

  return (
    <Table>
      <TableCaption>Current highest bid for this auction</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Bidder</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Bid ID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="bg-yellow-50">
          <TableCell>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </TableCell>
          <TableCell className="font-medium">
            {highestBid.user.username}
          </TableCell>
          <TableCell>{formatCurrency(highestBid.bid_amount)}</TableCell>
          <TableCell>{formatDateSafe(highestBid.bid_time)}</TableCell>
          <TableCell className="text-xs text-muted-foreground">
            {highestBid.bid_id}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
