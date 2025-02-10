"use client";

import React from "react";
import AdminControls from "./AdminControls";
import AdminContent from "./AdminContent";
import UserContent from "./UserContent";
import UserHeader from "./UserHeader";
import { useAuctionDetailsViewModel } from "./AuctionDetails.viewModel";
import UserContentSkeleton from "@/components/skeletons/UserContentSkeleton";
import AdminContentSkeleton from "@/components/skeletons/AdminContentSkeleton";

interface AuctionDetailsProps {
  isAdmin: boolean;
  token: string;
  auctionID: string;
}

const AuctionDetails: React.FC<AuctionDetailsProps> = ({
  isAdmin,
  token,
  auctionID,
}) => {
  const { auction, bids, isLoading, error } = useAuctionDetailsViewModel(
    auctionID,
    token,
  );

  if (isLoading) {
    return isAdmin ? <AdminContentSkeleton /> : <UserContentSkeleton />;
  }

  if (error || !auction) {
    return <div>Error loading auction details</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {isAdmin ? (
        <AdminControls auctionID={auctionID} />
      ) : (
        <UserHeader title={auction.title} description={auction.description} />
      )}
      {isAdmin ? (
        <AdminContent
          auction={auction}
          bids={bids}
          title={auction.title}
          currentBid={auction.current_highest_bid}
          reservePrice={auction.reserve_price}
          bidIncrement={auction.bid_increment}
        />
      ) : (
        <UserContent
          token={token}
          auctionID={auctionID}
          auction={auction}
          bids={bids}
          title={auction.title}
        />
      )}
    </div>
  );
};

export default AuctionDetails;
