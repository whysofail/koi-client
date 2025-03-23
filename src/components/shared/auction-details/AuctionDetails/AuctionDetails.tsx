"use client";

import React from "react";
import AdminControls from "../AdminControls/AdminControls";
import AdminContent from "../AdminContent/AdminContent";
import UserContent from "../UserContent";
import UserHeader from "../UserHeader";
import { useAuctionDetailsViewModel } from "./AuctionDetails.viewModel";
import UserContentSkeleton from "@/components/skeletons/UserContentSkeleton";
import AdminContentSkeleton from "@/components/skeletons/AdminContentSkeleton";
import { useSocket } from "@/hooks/use-socket";
import BackButton from "@/components/dashboard/BackButton";
import { getErrorMessage } from "@/lib/handleApiError";

interface AuctionDetailsProps {
  isAdmin: boolean;
  token: string;
  auctionID: string;
  withBack?: boolean;
  userId?: string;
  isBanned?: boolean;
}

const AuctionDetails: React.FC<AuctionDetailsProps> = ({
  isAdmin,
  token,
  auctionID,
  withBack = true,
  isBanned,
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
    return (
      <div className="container mx-auto p-6">
        <BackButton />
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <svg
            className="mb-4 h-16 w-16 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mb-2 text-xl font-semibold text-red-700">
            Unable to Load Auction
          </h2>
          <p className="mb-4 text-gray-600">
            {dataError
              ? getErrorMessage(dataError)
              : "The auction details could not be loaded. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-0">
      {withBack && <BackButton />}

      {isAdmin ? (
        <AdminControls
          token={token}
          auctionId={auctionID}
          bid_increment={auction.bid_increment}
          buynow_price={auction.buynow_price}
          koiId={auction.item}
          auctionStatus={auction.status}
        />
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
          token={token}
          auction={auction}
          bids={bids}
          title={auction.title}
          currentBid={auction.current_highest_bid}
          buynow_price={auction.buynow_price}
          bidIncrement={auction.bid_increment}
          participationFee={auction.participation_fee}
          startingBidPrice={auction.bid_starting_price}
        />
      ) : (
        <UserContent
          token={token}
          auctionID={auctionID}
          auction={auction}
          bids={bids}
          title={auction.title}
          isBanned={isBanned}
        />
      )}
    </div>
  );
};

export default AuctionDetails;
