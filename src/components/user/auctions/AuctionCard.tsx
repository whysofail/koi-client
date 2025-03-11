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

const AuctionCard: FC<AuctionCardProps> = ({
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

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AuctionCardGrid
        auction={auction}
        userBid={userBid}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default AuctionCard;
