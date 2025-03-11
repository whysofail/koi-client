"use client";

import React from "react";
import { Bid } from "@/types/auctionTypes";
import { formatCurrency } from "@/lib/formatCurrency";
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
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BidsTableProps {
  bids: Bid[];
  selectedBidId: string | undefined;
  onSelectBid: (bid: Bid) => void;
}

export const BidsTable: React.FC<BidsTableProps> = ({
  bids,
  selectedBidId,
  onSelectBid,
}) => {
  if (!bids || bids.length === 0) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        No bids found for this auction
      </Card>
    );
  }

  const sortedBids = [...bids].sort(
    (a, b) => parseFloat(b.bid_amount) - parseFloat(a.bid_amount),
  );

  return (
    <Table>
      <TableCaption>
        All bids for this auction - Click on a row to select as winner
      </TableCaption>
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
        {sortedBids.map((bid) => (
          <TableRow
            key={bid.bid_id}
            className={cn(
              "cursor-pointer hover:bg-muted/50",
              selectedBidId === bid.bid_id ? "bg-primary/10" : "",
            )}
            onClick={() => onSelectBid(bid)}
          >
            <TableCell>
              {selectedBidId === bid.bid_id && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </TableCell>
            <TableCell className="font-medium">{bid.user.username}</TableCell>
            <TableCell>{formatCurrency(bid.bid_amount)}</TableCell>
            <TableCell>{format(bid.bid_time, "dd-MM-yy")}</TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {bid.bid_id}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
