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
import Link from "next/link";
import { useEffect } from "react";

interface BidHistoryProps {
  bids: DetailedBid[];
}

export function BidHistory({ bids }: BidHistoryProps) {
  useEffect(() => {
    if (bids.length > 0) {
      console.log("Bids History data updated:", {
        time: new Date().toISOString(),
        count: bids.length,
      });
    }
  }, [bids]);
  if (bids.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-muted-foreground">No bids yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Be the first to bid!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md ">
      <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
        {bids.map((bid) => (
          <Link
            key={bid.bid_id}
            href={`/dashboard/users/${bid.user.user_id}`}
            passHref
          >
            <div className="flex  items-center space-x-3 border-b p-2 transition-colors last:border-b-0 hover:bg-slate-200/25">
              <div className="flex-shrink-0">
                {/* {bid.user?.avatarUrl ? (
                <img
                  src={bid.user.avatarUrl || "/placeholder.svg"}
                  alt={`${bid.user.name}'s avatar`}
                  className="h-8 w-8 rounded-full"
                />
              ) :
               */}

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="min-w-0 flex-grow">
                <div className="flex items-center space-x-2">
                  <p className="truncate  font-medium">{bid.user.username}</p>
                  <p className="text-sm">placed a bid</p>
                  <p className="truncate font-bold text-muted-foreground">
                    {formatCurrency(bid.bid_amount)}
                  </p>
                </div>
                <div>
                  {/* Bid id */}
                  <p className="text-xs text-muted-foreground">
                    Bid ID: {bid.bid_id}
                  </p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-xs text-muted-foreground">
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
          </Link>
        ))}
      </div>
    </div>
  );
}
