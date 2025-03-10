"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuctionStatus } from "@/types/auctionTypes";
import { HighestBidTable } from "./HighestBidTable";
import VerifyBidsTable from "./VerifyBidsTable";
import { useVerifyAuctionViewModel } from "./VerifyAuction.viewModel";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface VerifyAuctionViewProps {
  auctionId: string;
  auctionDetails: {
    auction_id: string;
    title: string;
    description: string;
    item: string;
    start_datetime: string;
    end_datetime: string;
    reserve_price: string;
    bid_increment: string;
    status: AuctionStatus;
  };
  token: string;
}

export const VerifyAuctionView: React.FC<VerifyAuctionViewProps> = ({
  auctionId,
  auctionDetails,
  token,
}) => {
  const {
    auction,
    isLoading,
    error,
    selectedBid,
    handleSelectBid,
    handleVerifyWinner,
    isUpdating,
    updateSuccess,
    updateError,
  } = useVerifyAuctionViewModel(auctionId, token);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading auction details...</span>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || "Failed to load auction details"}
        </AlertDescription>
      </Alert>
    );
  }

  const { highest_bid, bids } = auction;

  const formatDateSafe = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd-MM-yy");
    } catch {
      return dateString || "Invalid date";
    }
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Verify Auction: {auctionDetails.title}</CardTitle>
          <CardDescription>
            Review and select the winner for this auction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Auction Details</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Description:</span>{" "}
                  {auctionDetails.description}
                </p>
                <p>
                  <span className="font-medium">Item:</span>{" "}
                  {auctionDetails.item}
                </p>
                <p>
                  <span className="font-medium">Reserve Price:</span>{" "}
                  {formatCurrency(auctionDetails.reserve_price)}
                </p>
                <p>
                  <span className="font-medium">Bid Increment:</span>{" "}
                  {formatCurrency(auctionDetails.bid_increment)}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Auction Timeline</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {formatDateSafe(auctionDetails.start_datetime)}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{" "}
                  {formatDateSafe(auctionDetails.end_datetime)}
                </p>
                <p>
                  <span className="font-medium">Current Status:</span>{" "}
                  {auctionDetails.status}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {updateSuccess && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Winner has been successfully verified for this auction.
          </AlertDescription>
        </Alert>
      )}

      {updateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{updateError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Highest Bid</CardTitle>
          <CardDescription>
            This is the automatically selected winner based on the highest bid
            amount
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HighestBidTable highestBid={highest_bid} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Bids</CardTitle>
          <CardDescription>Select a different winner if needed</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Using the new dedicated VerifyBidsTable component */}
          <VerifyBidsTable
            bids={bids}
            selectedBidId={selectedBid?.bid_id}
            onSelectBid={handleSelectBid}
          />

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleVerifyWinner}
              disabled={isUpdating || !selectedBid || updateSuccess}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Winner
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
