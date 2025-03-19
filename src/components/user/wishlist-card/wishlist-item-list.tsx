"use client";

import Image from "next/image";
import { Heart, Timer } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Wishlist } from "@/types/wishlistTypes";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
import { getStartDateTime, getTimeRemaining } from "@/lib/utils";
import { AuctionStatus } from "@/types/auctionTypes";
import { formatCurrency } from "@/lib/formatCurrency";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";

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
    <Card className="overflow-hidden">
      <div className="flex flex-row">
        {/* Image container - fixed width on all screen sizes */}
        <div className="relative h-[150px] w-[150px] flex-shrink-0 sm:h-[180px] sm:w-[180px] md:h-52 md:w-52">
          <Image
            src={imageUrl}
            alt={wishlist.auction.title}
            fill
            className="aspect-square object-cover"
          />
        </div>

        {/* Content container */}
        <div className="flex flex-grow flex-col p-2 pl-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold sm:text-lg">
                {wishlist.auction.title}
              </h3>
              <StatusBadge status={wishlist.auction.status} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRemoveFromWishlist}
            >
              <Heart className="h-4 w-4 fill-primary text-primary dark:fill-white dark:text-white sm:h-5 sm:w-5" />
              <span className="sr-only">Remove from wishlist</span>
            </Button>
          </div>

          <p className="my-1 line-clamp-2 text-xs text-muted-foreground sm:my-2 sm:text-sm md:line-clamp-3">
            {wishlist.auction.description}
          </p>

          <div className="mt-auto flex flex-col items-start justify-between gap-2 sm:gap-4">
            <div className="flex w-full items-center justify-between">
              <div>
                <p className="text-xs font-medium sm:text-sm">
                  Current highest bid:
                </p>
                <p className="text-sm font-bold sm:text-lg">
                  {formatCurrency(wishlist.auction.current_highest_bid)}
                </p>
              </div>

              <Button size="sm" className="h-8 sm:hidden">
                <Link href={`/auctions/${wishlist.auction.auction_id}`}>
                  View
                </Link>
              </Button>
            </div>

            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
                <Timer className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{time}</span>
              </div>

              <Button className="hidden sm:inline-flex">
                <Link href={`/auctions/${wishlist.auction.auction_id}`}>
                  View Auction
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
