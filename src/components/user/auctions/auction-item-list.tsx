"use client";

import { formatDistanceToNow } from "date-fns";
import { DollarSign, Timer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { Auction } from "@/types/auctionTypes";
import type { Bid } from "@/types/bidTypes";
import type { FC } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";

interface AuctionItemListProps {
  auction: Omit<Auction, "bids" | "participants" | "user">;
  userBid?: Bid | null;
  currentUserId: string;
}

const AuctionItemList: FC<AuctionItemListProps> = ({ auction, userBid }) => {
  const endDate = new Date(auction.end_datetime);
  const isEnded = endDate < new Date();
  const timeLeft = isEnded
    ? "Ended"
    : formatDistanceToNow(endDate, { addSuffix: true });

  const userBidAmount = Number.parseFloat(userBid?.bid_amount ?? "0") || 0;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 flex-shrink-0 md:h-auto md:w-48">
          <Image
            src={`/placeholder.webp?height=400&width=400&text=${encodeURIComponent(auction.title)}`}
            alt={auction.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-grow flex-col p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{auction.title}</h3>
              <StatusBadge status={auction.status} />
            </div>
          </div>

          <p className="my-2 line-clamp-2 text-sm text-muted-foreground md:line-clamp-3">
            {auction.description}
          </p>

          <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
            <Timer className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>

          <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Your bid: {formatCurrency(userBidAmount)}</span>
          </div>

          <div className="mt-auto flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium">Current highest bid:</p>
              <p className="text-lg font-bold">
                {formatCurrency(Number(auction.current_highest_bid))}
              </p>
            </div>
            <Button
              variant={isEnded ? "secondary" : "default"}
              disabled={isEnded || auction.status !== "PUBLISHED"}
              asChild
            >
              <Link href={`/auctions/${auction.auction_id}`}>
                {isEnded ? "View Results" : "Place Bid"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AuctionItemList;
