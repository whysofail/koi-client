"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, DollarSign, Crown } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Auction } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { FC } from "react";

interface AuctionCardProps {
  auction: Omit<Auction, "bids" | "participants" | "user">;
  userBid: Omit<DetailedBid, "user" | "auction">;
  currentUserId: string;
}

const AuctionCard: FC<AuctionCardProps> = ({ auction, userBid }) => {
  const endDate = new Date(auction.end_datetime);
  const isEnded = endDate < new Date();
  const timeLeft = isEnded
    ? "Ended"
    : formatDistanceToNow(endDate, { addSuffix: true });

  const userBidAmount = Number.parseFloat(userBid.bid_amount);

  return (
    <Card className="flex flex-col">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt={auction.title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="space-y-2 pb-2">
        <h3 className="font-semibold leading-none tracking-tight">
          {auction.title}
        </h3>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {auction.description}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <DollarSign className="text-muted-foreground mr-2 h-4 w-4" />
            <span className="font-medium">
              Your bid: Rp. {userBidAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="text-muted-foreground mr-2 h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
          {Number(auction.current_highest_bid) > 0 && (
            <div className="flex items-center text-sm">
              <Crown className="text-muted-foreground mr-2 h-4 w-4" />
              <span>
                Current highest: Rp.{" "}
                {Number(auction.current_highest_bid).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={isEnded ? "secondary" : "default"}
          disabled={isEnded || auction.status !== "PUBLISHED"}
        >
          <Link href={`/auctions/${auction.auction_id}`}>
            {isEnded ? "View Results" : "Place Another Bid"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuctionCard;
