"use client";

import Image from "next/image";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isValid, parseISO } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Clock,
  Gavel,
  Tag,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
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

  const getStatusBadge = () => {
    switch (auction.status) {
      case "PUBLISHED":
        return (
          <Badge
            variant="outline"
            className="border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-900 dark:text-blue-200"
          >
            <Calendar className="mr-1 h-3 w-3" />
            Upcoming
          </Badge>
        );
      case "STARTED":
        return (
          <Badge
            variant="outline"
            className="border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-900 dark:text-green-200"
          >
            <Timer className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" />
            ENDED
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-yellow-300 bg-yellow-100 text-yellow-700 dark:border-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
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

  const getTimeInfo = () => {
    if (auction.status === "PUBLISHED") {
      return {
        label: "Starts",
        date: auction.start_datetime,
        icon: (
          <Calendar className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
        ),
      };
    } else if (auction.status === "STARTED") {
      return {
        label: "Ends",
        date: auction.end_datetime,
        icon: <Clock className="mr-1 h-4 w-4 text-red-600 dark:text-red-400" />,
      };
    } else {
      return {
        label: "Ended",
        date: auction.end_datetime,
        icon: (
          <CheckCircle2 className="mr-1 h-4 w-4 text-gray-600 dark:text-gray-400" />
        ),
      };
    }
  };

  const timeInfo = getTimeInfo();

  return (
    <div className="rounded-xl bg-[#E8D5B0] p-4 shadow-md transition-all hover:shadow-lg dark:bg-[#6a5c41] dark:text-gray-100">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : error ? (
          <Image
            src="/placeholder.webp"
            alt={auction.title || "Koi fish"}
            width={400}
            height={400}
            className="h-full w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
            priority
          />
        ) : (
          <>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={auction.title || "Koi fish"}
              width={400}
              height={400}
              className="h-full w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105"
              onError={handleImageError}
              priority={imageError}
            />

            <div className="absolute left-2 top-2">{getStatusBadge()}</div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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

      <div className="mb-2 flex items-center gap-2">
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
      )}

      <div className="mb-3 grid grid-cols-1 gap-2 text-sm">
        <div className="flex items-center">
          {auction.status === "STARTED" && (
            <>
              <Gavel className="mr-1 h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span>{auction.bids.length || 0} Bids</span>
            </>
          )}
        </div>
        <div className="flex items-center">
          {timeInfo.icon}
          <span>
            {timeInfo.label}: {formatDate(timeInfo.date)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-lg font-bold">
          <Tag className="mr-1 h-5 w-5 text-green-600 dark:text-green-400" />
          Rp. {Number(auction.buynow_price || 0).toLocaleString()}
        </div>
        <Link
          href={`/auctions/${auction.auction_id}`}
          className="flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          View Details <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
