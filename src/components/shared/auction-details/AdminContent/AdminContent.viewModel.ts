import { useState, useEffect } from "react";
import { Auction, AuctionStatus } from "@/types/auctionTypes";
import { DetailedBid } from "@/types/bidTypes";
import { formatDuration, intervalToDuration, isPast } from "date-fns";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { GalleryMediaItem } from "../GalleryMedia";
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

  const {
    data: koiData,
    isLoading: koiIsLoading,
    isError: koiIsError,
  } = useGetKoiByID(auction.item);
  const imageArray = koiData?.photo?.split("|") || [];
  const videoArray = koiData?.video?.split("|") || [];

  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  const videoBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/video/`;

  const koiMedia: GalleryMediaItem[] = [
    ...imageArray
      .filter((img) => img !== "")
      .map((img) => ({
        type: "image" as const,
        largeURL: `${imageBaseUrl}${img}`,
        width: 800,
        height: 400,
        alt: title,
        thumbnailURL: `${imageBaseUrl}${img}`, // Use image itself as thumbnail
      })),
    ...videoArray
      .filter((vid) => vid !== "")
      .map((vid) => ({
        type: "video" as const,
        largeURL: `${videoBaseUrl}${vid}`,
        width: 800,
        height: 400,
        alt: title,
        poster: undefined, // No need to define it
        thumbnailURL: undefined, // Let the video element handle the thumbnail
      })),
  ];

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
    koiData,
    koiIsLoading,
    koiIsError,
    koiMedia,
    lastBidUpdate,
    countdown,
    showVerifyButton: auction.status === AuctionStatus.PENDING,
    showVerifiedButton: auction.status === AuctionStatus.COMPLETED,
    showPublishButton: auction.status === AuctionStatus.DRAFT,
  };
}
