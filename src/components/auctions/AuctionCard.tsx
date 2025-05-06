"use client";

import Image from "next/image";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Gavel,
  Tag,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Auction } from "@/types/auctionTypes";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/formatCurrency";
import Countdown from "../shared/countdown/countdown";
import { isPast } from "date-fns";

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
  const { data: koiData, isLoading, error } = useGetKoiByID(auction.item);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  const imageArray = koiData?.photo?.split("|") || [];
  const imageUrl =
    !imageError && imageArray[0]
      ? `${imageBaseUrl}${imageArray[0]}`
      : "/placeholder.webp";

  // const formatDate = (dateString: string | null | undefined) => {
  //   if (!dateString) return "N/A";
  //   try {
  //     const date = parseISO(dateString);
  //     return isValid(date)
  //       ? format(date, "dd MMM yyyy, HH:mm O")
  //       : "Invalid date";
  //   } catch {
  //     return "Invalid date";
  //   }
  // };

  const getStatusBadge = () => {
    switch (auction.status) {
      case "PUBLISHED":
        return (
          <Badge
            variant="outline"
            className="rounded-xl border-blue-300 bg-blue-100 py-2 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-200"
          >
            <Calendar className="mr-1 h-4 w-4" />
            Upcoming
          </Badge>
        );
      case "STARTED":
        return (
          <Badge
            variant="outline"
            className="items-center justify-center rounded-xl border-green-300 bg-green-100 py-2 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-200"
          >
            <Timer className="mr-1 h-4 w-4" />
            {isPast(new Date(auction.end_datetime)) ? "Ended" : "Ongoing"}
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="rounded-xl border-gray-300 bg-gray-100 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <CheckCircle2 className="mr-1 h-4 w-4" />
            ENDED
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="rounded-xl border-yellow-300 bg-yellow-100 py-2 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
          >
            <AlertCircle className="mr-1 h-3 w-3" />
            {auction.status}
          </Badge>
        );
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

  // const getTimeBadge = () => {
  //   switch (auction.status) {
  //     case "PUBLISHED":
  //       return (
  //         <Badge
  //           variant="outline"
  //           className="rounded-xl border-blue-300 bg-blue-100 py-2 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-200"
  //         >
  //           Starts on {formatDate(auction.start_datetime)}
  //         </Badge>
  //       );
  //     case "STARTED":
  //       return (
  //         <Badge
  //           variant="outline"
  //           className="items-center justify-center rounded-xl border-green-300 bg-green-100 py-2 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-200"
  //         >
  //           Ends on {formatDate(auction.end_datetime)}
  //         </Badge>
  //       );
  //     case "COMPLETED":
  //       return (
  //         <Badge
  //           variant="outline"
  //           className="rounded-xl border-gray-300 bg-gray-100 py-2 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
  //         >
  //           <CheckCircle2 className="mr-1 h-4 w-4" />
  //           ENDED
  //         </Badge>
  //       );
  //     default:
  //       return (
  //         <Badge
  //           variant="outline"
  //           className="border-yellow-300 bg-yellow-100 py-2 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
  //         >
  //           <AlertCircle className="mr-1 h-3 w-3" />
  //           {auction.status}
  //         </Badge>
  //       );
  //   }
  // };

  return (
    <div className="flex aspect-[3.5/4] flex-col rounded-xl border-2 border-[#B1062C] bg-none p-4 pb-0 shadow-md transition-all hover:shadow-lg dark:bg-[#6a5c41] dark:text-gray-100">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : error ? (
          <Image
            src="/placeholder.webp"
            alt={auction.title || "Koi fish"}
            width={400}
            height={400}
            className="h-full w-full rounded-lg object-contain transition-transform duration-300 hover:scale-105"
            priority
          />
        ) : (
          <>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={auction.title || "Koi fish"}
              width={400}
              height={400}
              className="h-full w-full rounded-lg object-contain transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
              priority={imageError}
            />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleWishlistToggle}
                    disabled={isPendingWishlist}
                    className={cn(
                      "absolute bottom-2 right-2 rounded-full bg-none p-2 backdrop-blur-sm transition-all",
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
                          : "fill-none text-primary dark:text-gray-300",
                      )}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {auction.hasWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>

      {/* <div className="mb-2 flex items-center gap-2">
        <Link
          className="flex-1 text-lg font-medium leading-tight hover:underline"
          href={`/auctions/${auction.auction_id}`}
        >
          {auction.title}
        </Link>
      </div>

      {koiData && (
        <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
          {koiData.variety && (
            <div>
              {typeof koiData.variety === "object"
                ? koiData.variety.name
                : koiData.variety}
            </div>
          )}
          {koiData.size && <div>{koiData.size} cm</div>}
        </div>
      )} */}

      <div className="mb-3 grid grid-cols-1 gap-2 text-sm">
        <div>{getStatusBadge()}</div>
        <div className="flex items-center">
          <Countdown
            startDate={auction.start_datetime}
            endDate={auction.end_datetime}
            status={auction.status}
            className="rounded-xl"
          />
        </div>
        <div className="flex items-center">
          <>
            <Gavel className="mr-1 h-6 w-6 rounded-full bg-black p-1 text-white" />
            <span className="font-bold">{auction.bids.length || 0} Bids</span>
          </>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-lg font-bold">
            <TooltipProvider>
              <Tooltip>
                <Tag className="mr-1 h-6 w-6 rounded-full bg-black p-1 text-white" />

                <span className="self-start text-sm">
                  {formatCurrency(
                    auction.current_highest_bid ?? auction.bid_starting_price,
                  )}
                </span>

                <TooltipTrigger className="flex">
                  <Info className="ml-1 h-4 w-4 text-gray-500" />
                </TooltipTrigger>

                <TooltipContent>
                  {auction.current_highest_bid
                    ? `Highest bid: ${formatCurrency(auction.current_highest_bid)}`
                    : `Starting price: ${formatCurrency(auction.bid_starting_price)}`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Link
            href={`/auctions/${auction.auction_id}`}
            className="flex items-center text-sm font-medium text-primary hover:underline dark:text-blue-400"
          >
            View Details <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
