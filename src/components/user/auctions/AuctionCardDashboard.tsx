"use client";

import type { Auction } from "@/types/auctionTypes";
import type { Bid } from "@/types/bidTypes";
import { type FC } from "react";
import AuctionCardGrid from "./auction-item-grid";
import AuctionItemList from "./auction-item-list";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";

interface AuctionCardProps {
  auction: Omit<Auction, "bids" | "participants" | "user">;
  userBid?: Bid | null;
  currentUserId: string;
  variant?: "grid" | "list";
}

const AuctionCardDashboard: FC<AuctionCardProps> = ({
  auction,
  userBid,
  currentUserId,
  variant = "grid",
}) => {
  // Fetch koi image here
  const { data: koiData } = useGetKoiByID(auction.item || "");

  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;
  const imageArray = koiData?.photo?.split("|") || [];
  const imageUrl = imageArray[0]
    ? `${imageBaseUrl}${imageArray[0]}`
    : "/placeholder.webp";
  if (variant === "list") {
    return (
      <AuctionItemList
        auction={auction}
        userBid={userBid}
        photo={imageUrl}
        currentUserId={currentUserId}
      />
    );
  }

  // Return just the card without wrapping it in a grid
  return (
    <AuctionCardGrid
      auction={auction}
      userBid={userBid}
      currentUserId={currentUserId}
      photo={imageUrl}
    />
  );
};

export default AuctionCardDashboard;
