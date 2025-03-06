"use client";

import Image from "next/image";
import { Heart, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Wishlist } from "@/types/wishlistTypes";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
import { getTimeRemaining } from "@/lib/utils";

interface WishlistItemGridProps {
  wishlist: Wishlist;
  onRemoveFromWishlist?: (wishlistId: string) => void;
}

export function WishlistItemGrid({
  wishlist,
  onRemoveFromWishlist,
}: WishlistItemGridProps) {
  const handleRemoveFromWishlist = () => {
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(wishlist.wishlist_id);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={`/placeholder.webp?height=400&width=600&text=${encodeURIComponent(wishlist.auction.title)}`}
          alt={wishlist.auction.title}
          fill
          className="object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 rounded-full bg-white/80 hover:bg-white/90"
          onClick={handleRemoveFromWishlist}
        >
          <Heart className="fill-primary text-primary h-5 w-5" />
          <span className="sr-only">Remove from wishlist</span>
        </Button>
        <StatusBadge
          className="absolute bottom-2 right-2"
          status={wishlist.auction.status}
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <h3 className="line-clamp-1 text-lg font-semibold">
          {wishlist.auction.title}
        </h3>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
          {wishlist.auction.description}
        </p>
        <div className="text-muted-foreground mb-2 flex items-center gap-1 text-sm">
          <Timer className="h-4 w-4" />
          <span>Ending {getTimeRemaining(wishlist.auction.end_datetime)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <p className="text-sm font-medium">Current bid:</p>
          <p className="text-lg font-bold">
            ${wishlist.auction.current_highest_bid ?? "0"}
          </p>
        </div>
        <Button size="sm">View Auction</Button>
      </CardFooter>
    </Card>
  );
}
