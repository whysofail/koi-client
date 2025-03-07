"use client";

import useGetJoinedAuctions from "@/server/auction/participatedAuctions/queries";
import AuctionCard from "./AuctionCard";
import AuctionCardSkeleton from "@/components/skeletons/AuctionCardSkeleton";
import { FC } from "react";

interface MyAuctionListProps {
  token: string;
  currentUserId: string;
}

const AuctionList: FC<MyAuctionListProps> = ({ token, currentUserId }) => {
  const { data, isLoading } = useGetJoinedAuctions({
    token,
  });
  console.log(data);
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
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-semibold">No auctions found</p>
        <p className="text-muted-foreground mt-1 text-sm">
          You haven&apos;t participated in any auctions yet.
        </p>
      </div>
    );
  }

  if (auctionsData.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-semibold">No auctions found</p>
        <p className="text-muted-foreground mt-1 text-sm">
          You haven&apos;t participated in any auctions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {auctionsData.map((auction, idx) => (
        <AuctionCard
          key={idx}
          auction={auction.auction}
          userBid={auction.lastBid}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default AuctionList;
