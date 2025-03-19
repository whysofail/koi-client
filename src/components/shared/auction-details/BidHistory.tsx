"use client";

import { formatDistanceToNow } from "date-fns";
import type { DetailedBid } from "@/types/bidTypes";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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
    <div className="rounded-md">
      <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
        {bids.map((bid) => (
          <Link
            key={bid.bid_id}
            href={`/dashboard/users/${bid.user.user_id}`}
            passHref
          >
            <div className="flex flex-col border-b p-2 transition-colors last:border-b-0 hover:bg-slate-200/25 sm:flex-row sm:items-center sm:space-x-3">
              <div className="mb-2 flex items-center space-x-2 sm:mb-0 sm:flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-medium sm:hidden">{bid.user.username}</p>
              </div>

              <div className="min-w-0 flex-grow">
                <div className="flex flex-wrap items-center gap-1 sm:flex-nowrap sm:space-x-2">
                  <p className="hidden truncate font-medium sm:block">
                    {bid.user.username}
                  </p>
                  <p className="text-sm">placed a bid</p>
                  <p className="truncate font-bold text-muted-foreground">
                    {formatCurrency(bid.bid_amount)}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:block">
                  <p className="text-xs text-muted-foreground">
                    Bid ID: {bid.bid_id.substring(0, 8)}...
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="sm:hidden">
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
              </div>

              <div className="hidden sm:block">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
