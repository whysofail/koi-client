"use client";

import Image from "next/image";
import { Heart, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Wishlist } from "@/types/wishlistTypes";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
import { getStartDateTime, getTimeRemaining } from "@/lib/utils";
import { AuctionStatus } from "@/types/auctionTypes";

interface WishlistItemListProps {
  wishlist: Wishlist;
  onRemoveFromWishlist?: (wishlistId: string) => void;
}

export function WishlistItemList({
  wishlist,
  onRemoveFromWishlist,
}: WishlistItemListProps) {
  const handleRemoveFromWishlist = () => {
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(wishlist.wishlist_id);
    }
  };
  let time = "";
  switch (wishlist.auction.status) {
    case AuctionStatus.PUBLISHED:
      time = `Starting ${getStartDateTime(wishlist.auction.start_datetime)}`;
      break;
    case AuctionStatus.STARTED:
      time = `Ending ${getTimeRemaining(wishlist.auction.end_datetime)}`;
      break;
    case AuctionStatus.COMPLETED:
      time = `Ended ${getTimeRemaining(wishlist.auction.end_datetime)}`;
      break;
    default:
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 flex-shrink-0 md:h-auto md:w-48">
          <Image
            src={`/placeholder.webp?height=400&width=400&text=${encodeURIComponent(wishlist.auction.title)}`}
            alt={wishlist.auction.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-grow flex-col p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {wishlist.auction.title}
              </h3>
              <StatusBadge status={wishlist.auction.status} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveFromWishlist}
            >
              <Heart className="h-5 w-5 fill-primary text-primary" />
              <span className="sr-only">Remove from wishlist</span>
            </Button>
          </div>

          <p className="my-2 line-clamp-2 text-sm text-muted-foreground md:line-clamp-3">
            {wishlist.auction.description}
          </p>

          <div className="mt-auto flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-medium">Current bid:</p>
                <p className="text-lg font-bold">
                  ${wishlist.auction.current_highest_bid ?? 0}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>{time}</span>
              </div>
            </div>
            <Button>View Auction</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
