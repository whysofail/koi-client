"use client";

import { formatDistanceToNow } from "date-fns";
import type { DetailedBid } from "@/types/bidTypes";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { User } from "lucide-react";

interface BidHistoryProps {
  bids: DetailedBid[];
}

export function BidHistory({ bids }: BidHistoryProps) {
  if (bids.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground text-sm">No bids yet</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Be the first to bid!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md ">
      <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
        {bids.map((bid) => (
          <div
            key={bid.bid_id}
            className="flex items-center space-x-3 border-b p-2 transition-colors last:border-b-0 hover:bg-slate-300"
          >
            <div className="flex-shrink-0">
              {/* {bid.user?.avatarUrl ? (
                <img
                  src={bid.user.avatarUrl || "/placeholder.svg"}
                  alt={`${bid.user.name}'s avatar`}
                  className="h-8 w-8 rounded-full"
                />
              ) :
               */}

              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                <User className="text-muted-foreground h-4 w-4" />
              </div>
            </div>
            <div className="min-w-0 flex-grow">
              <div className="flex items-center space-x-2">
                <p className="truncate  font-medium">
                  {bid.user?.username || "Anonymous"}
                </p>
                <p className="text-sm">placed a bid</p>
                <p className="text-muted-foreground truncate font-bold">
                  {formatCurrency(bid.bid_amount)}
                </p>
              </div>
              <div>
                {/* Bid id */}
                <p className="text-muted-foreground text-xs">
                  Bid ID: {bid.bid_id}
                </p>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(bid.bid_time), {
                      addSuffix: true,
                    })}
                  </p>
                </TooltipTrigger>
                <TooltipContent sideOffset={0} side="top" align="start">
                  {new Date(bid.bid_time).toLocaleString()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
}
