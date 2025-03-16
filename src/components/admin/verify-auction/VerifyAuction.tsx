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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VerifyAuctionSkeleton from "@/components/skeletons/VerifyAuctionSkeleton";
import { Clock, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/admin/auctions-table/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifyAuctionViewProps {
  auctionId: string;
  auctionDetails: {
    auction_id: string;
    title: string;
    description: string;
    item: string;
    start_datetime: string;
    end_datetime: string;
    buynow_price: string;
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

  const getDuration = () => {
    const start = parseISO(auctionDetails.start_datetime);
    const end = parseISO(auctionDetails.end_datetime);
    const diffDays = differenceInDays(end, start);
    const diffHours = differenceInHours(end, start) % 24;
    return `${diffDays} days, ${diffHours} hours`;
  };

  const highestBid =
    auction.bids.length > 0
      ? auction.bids.reduce(
          (max, bid) =>
            parseFloat(bid.bid_amount) > parseFloat(max.bid_amount) ? bid : max,
          auction.bids[0],
        )
      : null;

  return (
    <div className="space-y-6">
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
              <strong className="text-black dark:text-white">
                {bidToConfirm?.user.username}
              </strong>{" "}
              as the winner with a bid of{" "}
              <strong className="text-black dark:text-white">
                {formatCurrency(bidToConfirm?.bid_amount ?? "")}
              </strong>
              ? This action cannot be undone.
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

      <Card className="overflow-hidden border shadow-sm">
        {updateSuccess && (
          <Alert className="rounded-none border-0 border-b border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Auction Verified</AlertTitle>
            <AlertDescription>
              This auction has been verified and the winner has been selected.
            </AlertDescription>
          </Alert>
        )}

        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-bold sm:text-2xl">
                {auctionDetails.title}
              </CardTitle>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  #{auctionDetails.auction_id}
                </Badge>
                <StatusBadge status={auctionDetails.status} />
              </div>
            </div>

            {highestBid && (
              <div className="mt-2 rounded-lg bg-primary/10 p-3 sm:mt-0">
                <div className="text-sm font-medium text-muted-foreground">
                  Highest Bid
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(highestBid.bid_amount)}
                </div>
                <div className="text-xs text-muted-foreground">
                  by {highestBid.user.username}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="details" className="w-full">
            <div className="border-b px-6 pt-2">
              <TabsList className="w-full justify-start gap-4">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  <Info className="mr-2 h-4 w-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="details" className="p-6 pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Description
                  </h3>
                  <p className="mt-1">{auctionDetails.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/20 p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Koi Item ID
                    </h4>
                    <p className="mt-1 font-mono">{auctionDetails.item}</p>
                  </div>

                  <div className="rounded-lg bg-muted/20 p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Buy Now Price
                    </h4>
                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(auctionDetails.buynow_price)}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Bid Increment
                    </h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Minimum amount to increase bid by</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="mt-1">
                    {formatCurrency(auctionDetails.bid_increment)}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="p-6 pt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/20 p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Start Date
                    </h4>
                    <p className="mt-1 font-medium">
                      {format(
                        parseISO(auctionDetails.start_datetime),
                        "MMMM d, yyyy",
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        parseISO(auctionDetails.start_datetime),
                        "h:mm a",
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted/20 p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      End Date
                    </h4>
                    <p className="mt-1 font-medium">
                      {format(
                        parseISO(auctionDetails.end_datetime),
                        "MMMM d, yyyy",
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(parseISO(auctionDetails.end_datetime), "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/20 p-4">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Duration
                  </h4>
                  <p className="mt-1">{getDuration()}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
