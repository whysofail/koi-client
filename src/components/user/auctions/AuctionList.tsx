"use client";

import useGetJoinedAuctions from "@/server/auction/participatedAuctions/queries";
import AuctionCardDashboard from "./AuctionCardDashboard";
import AuctionCardSkeleton from "@/components/skeletons/AuctionCardSkeleton";
import { FC, useState } from "react";
import { EmptyAuction } from "./empty-auction";
import { ViewToggle } from "../toggle/view-toggle";

interface MyAuctionListProps {
  token: string;
  currentUserId: string;
}

const AuctionList: FC<MyAuctionListProps> = ({ token, currentUserId }) => {
  const { data, isLoading } = useGetJoinedAuctions({
    token,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <AuctionCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const auctionsData = data?.data;

  if (!auctionsData || auctionsData.length === 0) {
    return <EmptyAuction />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-end">
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === "list" ? (
        // List view - render items directly
        <div className="space-y-4">
          {auctionsData.map((auction, idx) => (
            <AuctionCardDashboard
              key={auction.auction.auction_id || idx}
              auction={auction.auction}
              userBid={auction.lastBid}
              currentUserId={currentUserId}
              variant="list"
            />
          ))}
        </div>
      ) : (
        // Grid view - wrap items in a grid container
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {auctionsData.map((auction, idx) => (
            <AuctionCardDashboard
              key={auction.auction.auction_id || idx}
              auction={auction.auction}
              userBid={auction.lastBid}
              currentUserId={currentUserId}
              variant="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionList;
