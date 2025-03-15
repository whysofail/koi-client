"use client";

import Image from "next/image";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isValid, parseISO } from "date-fns";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Auction } from "@/types/auctionTypes";

interface AuctionCardProps {
  auction: Auction;
  onAddToWishlist?: (auctionId: string) => void;
  onRemoveFromWishlist?: (auctionId: string) => void;
  isPendingWishlist?: boolean;
}

export default function AuctionCard({
  auction,
  onAddToWishlist,
  onRemoveFromWishlist,
  isPendingWishlist = false,
}: AuctionCardProps) {
  const { data: koiData, isLoading, error } = useGetKoiByID(auction.item || "");

  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  const imageArray = koiData?.photo?.split("|") || [];
  const imageUrl = imageArray[0] ? `${imageBaseUrl}${imageArray[0]}` : "";

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      return isValid(date)
        ? format(date, "dd MMM yyyy, HH:mm O")
        : "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  const handleWishlistToggle = () => {
    if (isPendingWishlist) return;

    if (auction.hasWishlisted) {
      onRemoveFromWishlist?.(auction.auction_id);
    } else {
      onAddToWishlist?.(auction.auction_id);
    }
  };

  return (
    <div className="rounded-xl bg-[#E8D5B0] p-4 dark:bg-[#6a5c41] dark:text-gray-100">
      <div className="relative mb-2 aspect-square">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : error || !imageUrl ? (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-blue-100 text-sm text-gray-500">
            No image available
          </div>
        ) : (
          <>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={auction.title || "Koi fish"}
              width={400}
              height={400}
              className="h-full w-full rounded-lg bg-blue-500 object-cover"
            />
            <button
              onClick={handleWishlistToggle}
              disabled={isPendingWishlist}
              className={cn(
                "absolute bottom-2 right-2 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-all",
                "hover:bg-white hover:shadow-md",
                "dark:bg-gray-800/80 dark:hover:bg-gray-800",
                isPendingWishlist && "opacity-70",
              )}
              aria-label={
                auction.hasWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  auction.hasWishlisted
                    ? "fill-red-500 text-red-500"
                    : "fill-none text-gray-600 dark:text-gray-300",
                )}
              />
            </button>
          </>
        )}
      </div>
      <Link
        className="mb-2 block text-lg font-medium hover:underline"
        href={`/auctions/${auction.auction_id}`}
      >
        {auction.title}
      </Link>
      <div className="mb-2 flex justify-between text-sm">
        <span>{auction.bids.length || 0} Bids</span>
        <span>{formatDate(auction.end_datetime)}</span>
      </div>
      <div className="mb-3 font-bold">
        Rp. {Number(auction.buynow_price || 0).toLocaleString()}
      </div>
    </div>
  );
}
