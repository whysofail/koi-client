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
import VerifyBidsTable from "./VerifyBidsTable";
import { useVerifyAuctionViewModel } from "./VerifyAuction.viewModel";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  format,
  differenceInDays,
  differenceInHours,
  parseISO,
} from "date-fns";
import VerifyAuctionSkeleton from "@/components/skeletons/VerifyAuctionSkeleton";
import { Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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

const VerifyAuction: React.FC<VerifyAuctionViewProps> = ({
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
    dialogOpen,
    setDialogOpen,
    bidToConfirm,
  } = useVerifyAuctionViewModel(auctionId, token);

  if (isLoading) {
    return <VerifyAuctionSkeleton />;
  }

  if (error || !auction) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Auction</AlertTitle>
        <AlertDescription>
          {error || "Failed to load auction details. Please try again later."}
        </AlertDescription>
        <div className="mt-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  const getStatusBadge = (status: AuctionStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge>PENDING</Badge>;
      case "COMPLETED":
        return <Badge>COMPLETED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {updateSuccess && (
        <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          <CheckCircle className="h-5 w-5" />
          <AlertTitle>Winner Verified Successfully</AlertTitle>
          <AlertDescription>
            The winner has been successfully verified for this auction.
          </AlertDescription>
        </Alert>
      )}

      {updateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>{updateError}</AlertDescription>
        </Alert>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Winner Selection</DialogTitle>
            <DialogDescription>
              Are you sure you want to select{" "}
              {bidToConfirm?.user.username || "this bidder"} as the winner with
              a bid of{" "}
              {bidToConfirm ? formatCurrency(bidToConfirm.bid_amount) : "$0"}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyWinner}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>Confirm Selection</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-2xl">{auctionDetails.title}</CardTitle>
            </div>
            <div>{getStatusBadge(auctionDetails.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Info className="h-5 w-5 text-muted-foreground" />
                Auction Details
              </h3>
              <div className="rounded-lg bg-muted/20 p-4">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Description
                    </dt>
                    <dd className="mt-1">{auctionDetails.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Item
                    </dt>
                    <dd className="mt-1">{auctionDetails.item}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Reserve Price
                      </dt>
                      <dd className="mt-1 font-medium text-primary">
                        {formatCurrency(auctionDetails.reserve_price)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Bid Increment
                      </dt>
                      <dd className="mt-1">
                        {formatCurrency(auctionDetails.bid_increment)}
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5 text-muted-foreground" />
                Auction Timeline
              </h3>
              <div className="rounded-lg bg-muted/20 p-4">
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </dt>
                    <dd className="mt-1">
                      {format(
                        parseISO(auctionDetails.start_datetime),
                        "dd-MM-yy",
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      End Date
                    </dt>
                    <dd className="mt-1">
                      {format(
                        parseISO(auctionDetails.end_datetime),
                        "dd-MM-yy",
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Duration
                    </dt>
                    <dd className="mt-1">
                      {(() => {
                        const start = parseISO(auctionDetails.start_datetime);
                        const end = parseISO(auctionDetails.end_datetime);

                        const diffDays = differenceInDays(end, start);
                        const diffHours = differenceInHours(end, start) % 24;

                        return `${diffDays} days, ${diffHours} hours`;
                      })()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-xl">Bids Summary</CardTitle>
              <CardDescription>
                {auction.bids.length} total bids • Click &quot;Select as
                Winner&quot; to verify a bid
              </CardDescription>
            </div>
            <div>
              {selectedBid && updateSuccess && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-primary text-primary"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Winner: {selectedBid.user.username}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <VerifyBidsTable
            bids={auction.bids}
            selectedBidId={selectedBid?.bid_id}
            onSelectBid={handleSelectBid}
            isVerified={updateSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyAuction;
