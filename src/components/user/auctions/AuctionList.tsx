"use client";

import useGetJoinedAuctions from "@/server/auction/participatedAuctions/queries";
import AuctionCard from "./AuctionCard";
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

  if (!auctionsData) {
    return <EmptyAuction />;
  }

  if (auctionsData.length === 0) {
    return <EmptyAuction />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-end">
        <div className="">
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {auctionsData.map((auction, idx) => (
        <AuctionCard
          key={idx}
          auction={auction.auction}
          userBid={auction.lastBid}
          currentUserId={currentUserId}
          variant={viewMode}
        />
      ))}
    </div>
  );
};

export default AuctionList;
