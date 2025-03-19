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
import { getStartDateTime, getTimeRemaining } from "@/lib/utils";
import { AuctionStatus } from "@/types/auctionTypes";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";

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
      onRemoveFromWishlist(wishlist.auction_id);
    }
  };

  const { data: koiData } = useGetKoiByID(wishlist.auction.item || "");
  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  const imageArray = koiData?.photo?.split("|") || [];
  const imageUrl = imageArray[0]
    ? `${imageBaseUrl}${imageArray[0]}`
    : "/placeholder.webp";

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
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
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
          <Heart className="h-5 w-5 fill-primary text-primary" />
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
        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
          {wishlist.auction.description}
        </p>
        <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
          <Timer className="h-4 w-4" />
          <span>{time}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <p className="text-sm font-medium">Current highest bid:</p>
          <p className="text-lg font-bold">
            {formatCurrency(wishlist.auction.current_highest_bid) ?? "0"}
          </p>
        </div>
        <Button size="sm">
          <Link href={`/auctions/${wishlist.auction.auction_id}`}>
            View Auction
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
