"use client";
import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";
import Link from "next/link";
const AuctionBanner = () => {
  // Get current auctions with increased limit to 5
  const { data: currentAuctions } = useGetAllAuctions({
    limit: 5,
    orderBy: AuctionOrderBy.START_DATETIME,
    order: "ASC",
    status: AuctionStatus.STARTED,
  });

  // State for carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentKoiId, setCurrentKoiId] = useState("");

  // Update current koi ID when auctions or index changes
  useEffect(() => {
    if (currentAuctions?.data && currentAuctions.data.length > 0) {
      setCurrentKoiId(currentAuctions.data[currentIndex]?.item || "");
    }
  }, [currentAuctions, currentIndex]);

  // Fetch current koi data
  const { data: currentKoi } = useGetKoiByID(currentKoiId, {
    enabled: !!currentKoiId,
  });

  // Utility functions
  const getImageUrl = (photo: string) => {
    const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
    const imageArray = photo?.split("|") || [];
    return imageArray[0]
      ? `${imageBaseUrl}${imageArray[0]}`
      : "/placeholder.svg";
  };

  const formatBannerDate = (dateString: string | number | Date): string => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy.MM.dd HH:mm");
    } catch (error) {
      console.error(error);
      return String(dateString);
    }
  };

  // Navigation handlers
  const goToPrevious = () => {
    if (!currentAuctions?.data?.length) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? currentAuctions.data.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    if (!currentAuctions?.data?.length) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === currentAuctions.data.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToSlide = (slideIndex: SetStateAction<number>) => {
    setCurrentIndex(slideIndex);
  };

  // Get current auction
  const currentAuction = currentAuctions?.data?.[currentIndex];

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="relative overflow-hidden rounded-3xl bg-black">
        <div className="relative h-[200px] sm:h-[300px] md:h-[400px]">
          {/* Invisible Link Overlay */}
          {currentAuction && (
            <Link
              href={`/auctions/${currentAuction.auction_id}`}
              className="absolute inset-0 z-10"
              aria-label="Go to auction"
            />
          )}

          {/* Current koi image */}
          <Image
            src={
              currentKoi?.photo ? getImageUrl(currentKoi.photo) : "/ikan.png"
            }
            alt={currentKoi?.code || "Koi fish"}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

          {/* Content */}
          <div className="relative z-20 max-w-2xl p-4 text-white sm:p-8 md:p-12">
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl md:mb-4 md:text-5xl">
              Ongoing Event
            </h1>
            {currentAuction ? (
              <>
                <p className="mb-2 text-xs text-yellow-200 sm:text-sm md:mb-4">
                  Period of the event |{" "}
                  {formatBannerDate(currentAuction.start_datetime)} -{" "}
                  {formatBannerDate(currentAuction.end_datetime)}
                </p>
                <p className="hidden text-xs text-gray-200 sm:block sm:text-sm md:text-base">
                  {currentAuction.description || "No description available."}
                </p>
              </>
            ) : (
              <p className="mb-2 text-xs text-yellow-200 sm:text-sm md:mb-4">
                No current events at this time
              </p>
            )}
          </div>

          {/* Navigation buttons (z-30 ensures they are above the link) */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 transform rounded-full bg-slate-600 p-1 sm:left-4 sm:p-2"
          >
            <ChevronLeft className="h-4 w-4 text-white sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 transform rounded-full bg-slate-600 p-1 sm:right-4 sm:p-2"
          >
            <ChevronRight className="h-4 w-4 text-white sm:h-6 sm:w-6" />
          </button>

          {/* Dots for navigation */}
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 transform space-x-2 sm:bottom-6">
            {currentAuctions?.data?.map((_, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 cursor-pointer rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionBanner;
