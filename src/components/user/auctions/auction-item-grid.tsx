"use client";

import { formatDistanceToNow } from "date-fns";
import { DollarSign, Crown, Timer } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { Auction } from "@/types/auctionTypes";
import type { Bid } from "@/types/bidTypes";
import type { FC } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";

interface AuctionCardGridProps {
  auction: Omit<Auction, "bids" | "participants" | "user">;
  userBid?: Bid | null;
  photo: string;
  currentUserId: string;
}

const AuctionCardGrid: FC<AuctionCardGridProps> = ({
  auction,
  userBid,
  photo,
}) => {
  const endDate = new Date(auction.end_datetime);
  const isEnded = endDate < new Date();
  const timeLeft = isEnded
    ? "Ended"
    : formatDistanceToNow(endDate, { addSuffix: true });

  const userBidAmount = Number.parseFloat(userBid?.bid_amount ?? "0") || 0;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={photo}
          alt={auction.title}
          height={400}
          width={400}
          className="h-full w-full rounded-lg object-contain transition-transform duration-300 hover:scale-105 "
        />
        <StatusBadge
          className="absolute bottom-2 right-2"
          status={auction.status}
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <h3 className="line-clamp-1 text-lg font-semibold">{auction.title}</h3>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
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
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <p className="text-sm font-medium">Current highest bid:</p>
          <div className="flex items-center gap-1">
            <Crown className="h-6 w-6 text-accent" />
            <p className="text-lg font-bold">
              {formatCurrency(Number(auction.current_highest_bid))}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant={isEnded ? "secondary" : "default"}
          disabled={isEnded || auction.status !== "PUBLISHED"}
          asChild
        >
          <Link href={`/auctions/${auction.auction_id}`}>
            {isEnded ? "View Results" : "Place Bid"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuctionCardGrid;
