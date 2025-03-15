"use client";

import type { Auction } from "@/types/auctionTypes";
import type { Bid } from "@/types/bidTypes";
import type { FC } from "react";
import AuctionCardGrid from "./auction-item-grid";
import AuctionItemList from "./auction-item-list";

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
  if (variant === "list") {
    return (
      <AuctionItemList
        auction={auction}
        userBid={userBid}
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
    />
  );
};

export default AuctionCardDashboard;
