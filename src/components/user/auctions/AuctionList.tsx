"use client";

import AuctionCard from "./AuctionCard";
import useGetBids from "@/server/bid/getBids/queries";
import { LoggedInUserBidsResponse } from "@/types/bidTypes";
import { FC } from "react";

interface MyAuctionListProps {
  token: string;
  currentUserId: string;
}

const AuctionList: FC<MyAuctionListProps> = ({ token, currentUserId }) => {
  const { data, isLoading } = useGetBids({
    token,
    isAdmin: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const response = data as LoggedInUserBidsResponse;
  const bids = response?.data || [];

  const auctionMap = new Map();
  bids.forEach((bid) => {
    const existingBid = auctionMap.get(bid.auction.auction_id);
    if (
      !existingBid ||
      Number(bid.bid_amount) > Number(existingBid.bid_amount)
    ) {
      auctionMap.set(bid.auction.auction_id, bid);
    }
  });

  const participatedAuctions = Array.from(auctionMap.values());

  if (participatedAuctions.length === 0) {
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
      {participatedAuctions.map((bid) => (
        <AuctionCard
          key={bid.auction.auction_id}
          auction={bid.auction}
          userBid={bid}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default AuctionList;
