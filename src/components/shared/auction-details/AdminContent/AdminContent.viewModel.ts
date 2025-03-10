import { useState, useEffect } from "react";
import { Auction, AuctionStatus } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { formatDuration, intervalToDuration, isPast } from "date-fns";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";

interface GalleryImage {
  thumbnailURL: string;
  largeURL: string;
  width: number;
  height: number;
  alt: string;
}

export interface AdminContentViewModelProps {
  auction: Auction;
  bids: DetailedBid[];
  title: string;
}

export function useAdminContentViewModel({
  auction,
  bids,
  title,
}: AdminContentViewModelProps) {
  const [lastBidUpdate, setLastBidUpdate] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState<string>("");

  const { data } = useGetKoiByID(auction.item);
  const imageArray = data?.photo?.split("|") || [];
  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;

  const koiImages: GalleryImage[] = imageArray
    .filter((img) => img !== "")
    .map((img) => ({
      thumbnailURL: imageBaseUrl + img,
      largeURL: imageBaseUrl + img,
      height: 800,
      width: 400,
      alt: title,
    }));

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endTime = new Date(auction.end_datetime);

      if (auction.status === AuctionStatus.PENDING) {
        setCountdown("Auction ended. Pending for payment verification");
        return;
      }
      if (auction.status !== AuctionStatus.STARTED) {
        setCountdown("Auction has not started yet");
        return;
      }

      if (isPast(endTime)) {
        setCountdown("Auction has ended");
        return;
      }

      const duration = intervalToDuration({
        start: now,
        end: endTime,
      });

      setCountdown(formatDuration(duration, { delimiter: ", " }));
    };

    updateCountdown(); // Initial update
    const intervalId = setInterval(updateCountdown, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [auction.end_datetime, auction.status]);

  useEffect(() => {
    if (bids?.length) {
      setLastBidUpdate(new Date());
    }
  }, [bids]);

  return {
    koiImages,
    lastBidUpdate,
    countdown,
    showVerifyButton: auction.status === AuctionStatus.PENDING,
    showVerifiedButton: auction.status === AuctionStatus.COMPLETED,
  };
}
