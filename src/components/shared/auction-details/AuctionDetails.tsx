"use client";

import React from "react";
import AdminControls from "./AdminControls";
import AdminContent from "./AdminContent";
import UserContent from "./UserContent";
import UserHeader from "./UserHeader";
import { useAuctionDetailsViewModel } from "./AuctionDetails.viewModel";
import UserContentSkeleton from "@/components/skeletons/UserContentSkeleton";
import AdminContentSkeleton from "@/components/skeletons/AdminContentSkeleton";
import { useSocket } from "@/hooks/use-socket";
import BackButton from "@/components/dashboard/BackButton";

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
  const { publicSocket } = useSocket();
  const {
    auction,
    bids,
    isLoading,
    error: dataError,
    socketStatus,
  } = useAuctionDetailsViewModel(auctionID, token, publicSocket);

  if (isLoading) {
    return isAdmin ? <AdminContentSkeleton /> : <UserContentSkeleton />;
  }

  if (dataError || !auction) {
    return <div>Error loading auction details</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <BackButton />
      {isAdmin ? (
        <AdminControls auctionID={auctionID} />
      ) : (
        <UserHeader title={auction.title} description={auction.description} />
      )}
      {isAdmin && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                socketStatus.isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-600">
              {socketStatus.isConnecting
                ? "Connecting..."
                : socketStatus.isConnected
                  ? "Connected"
                  : "Disconnected"}
            </span>
          </div>
          {socketStatus.lastReceivedAt && (
            <div className="text-sm text-gray-600">
              Last update: {socketStatus.lastReceivedAt.toLocaleTimeString()}
            </div>
          )}
        </div>
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
