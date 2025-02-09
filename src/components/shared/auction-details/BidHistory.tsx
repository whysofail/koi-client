"use client";

import { formatDistanceToNow } from "date-fns";
import { Bid } from "@/types/bidTypes";

interface BidHistoryProps {
  bids: Bid[];
}

export function BidHistory({ bids }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground text-sm">No bids yet</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Be the first to bid!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <div key={bid.bid_id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Rp. {Number(bid.bid_amount).toLocaleString()}
            </p>
            <p className="text-muted-foreground text-sm">
              Bid ID: {bid.bid_id}
            </p>
          </div>
          <p className="text-muted-foreground text-sm">
            {formatDistanceToNow(new Date(bid.bid_time), {
              addSuffix: true,
            })}
          </p>
        </div>
      ))}
    </div>
  );
}
