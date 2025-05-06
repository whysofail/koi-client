"use client";

import { useState } from "react";
import { Loader2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePlaceBidForm } from "./PlaceBidForm.viewModel";
import { AuctionStatus } from "@/types/auctionTypes";
import { JoinAuctionDialog } from "../JoinAuctionDialog/join-auction-dialog";
import { cn } from "@/lib/utils";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

interface PlaceBidFormProps {
  token: string;
  title: string;
  auctionID: string;
  currentBid: number;
  minIncrement: number;
  isEnded: boolean;
  hasJoined: boolean;
  status: AuctionStatus;
  participationFee: number;
  userBalance: number;
  bidStartingPrice: number;
  buyNowPrice?: number;
  isBanned?: boolean;
}

const PlaceBidForm = ({
  token,
  title,
  auctionID,
  currentBid,
  minIncrement,
  isEnded,
  hasJoined,
  status,
  participationFee,
  userBalance,
  bidStartingPrice,
  buyNowPrice,
  isBanned,
}: PlaceBidFormProps) => {
  const {
    form,
    isSubmitting,
    minBid,
    onSubmit,
    // handleBuyNow,
    // isBuyNowLoading,
  } = usePlaceBidForm(
    token,
    auctionID,
    currentBid,
    minIncrement,
    bidStartingPrice,
  );

  const [isFocused, setIsFocused] = useState(false);
  // const [isBuyNowDialogOpen, setIsBuyNowDialogOpen] = useState(false);

  const currentAmount = form.watch("amount") || 0;
  const isValidBid = currentAmount >= minBid;

  const formatAmount = (value: number) => {
    return value.toLocaleString("id-ID");
  };

  const handleIncrement = (amount: number) => {
    const newValue = (currentAmount || minBid) + amount;
    form.setValue("amount", newValue);
    form.trigger("amount");
  };

  const handleQuickBid = (multiplier: number) => {
    const quickBidAmount = minBid + minIncrement * multiplier;
    form.setValue("amount", quickBidAmount);
    form.trigger("amount");
  };

  if (isBanned) {
    return (
      <Button className="w-full" disabled>
        Your account is banned and cannot participate in auctions.
      </Button>
    );
  }

  if (isEnded) {
    return (
      <Button className="w-full" disabled>
        Auction Ended
      </Button>
    );
  }

  if (!token) {
    return (
      <Button className="w-full" disabled>
        Please login to place bid
      </Button>
    );
  }

  if (status === AuctionStatus.PUBLISHED && buyNowPrice && token) {
    return (
      <>
        <Button className="w-full" disabled>
          Auction not started
        </Button>

        {/*
        <Button
          className="mt-2 w-full"
          variant="secondary"
          onClick={() => setIsBuyNowDialogOpen(true)}
        >
          Buy Now: Rp {formatAmount(buyNowPrice)}
        </Button>

        <Dialog open={isBuyNowDialogOpen} onOpenChange={setIsBuyNowDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Buy Now</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to buy this item for Rp{" "}
              {formatAmount(buyNowPrice)}?
            </p>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsBuyNowDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await handleBuyNow();
                  setIsBuyNowDialogOpen(false);
                }}
                disabled={isBuyNowLoading}
              >
                {isBuyNowLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Buy Now"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        */}
      </>
    );
  }

  if (
    !hasJoined &&
    !isEnded &&
    (status === AuctionStatus.PUBLISHED || status === AuctionStatus.STARTED)
  ) {
    return (
      <>
        <JoinAuctionDialog
          auctionTitle={title}
          token={token}
          auctionID={auctionID}
          participationFee={participationFee}
          walletBalance={userBalance}
        />
        {/*
        {buyNowPrice && (
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => setIsBuyNowDialogOpen(true)}
          >
            Buy Now: Rp {formatAmount(buyNowPrice)}
          </Button>
        )}

        {buyNowPrice && (
          <Dialog
            open={isBuyNowDialogOpen}
            onOpenChange={setIsBuyNowDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Buy Now</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to buy this item for Rp{" "}
                {formatAmount(buyNowPrice)}?
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBuyNowDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await handleBuyNow();
                    setIsBuyNowDialogOpen(false);
                  }}
                  disabled={isBuyNowLoading}
                >
                  {isBuyNowLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Buy Now"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        */}
      </>
    );
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 rounded-r-none"
                      onClick={() => handleIncrement(-minIncrement)}
                      disabled={currentAmount <= minBid}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease bid</span>
                    </Button>
                    <FormControl>
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          Rp
                        </div>
                        <Input
                          type="text"
                          inputMode="numeric"
                          className={cn(
                            "rounded-none pl-9 pr-4 text-right",
                            isFocused && "ring-2 ring-ring",
                            !isValidBid &&
                              "border-destructive focus-visible:ring-destructive",
                          )}
                          value={field.value ? formatAmount(field.value) : ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, "");
                            field.onChange(value ? Number(value) : "");
                          }}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                      </div>
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 rounded-l-none"
                      onClick={() => handleIncrement(minIncrement)}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase bid</span>
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.setValue("amount", minBid)}
                      className="flex-1 text-xs"
                    >
                      Min: Rp {formatAmount(minBid)}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickBid(1)}
                      className="flex-1 text-xs"
                    >
                      +{formatAmount(minIncrement)}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickBid(4)}
                      className="flex-1 text-xs"
                    >
                      +{formatAmount(minIncrement * 4)}
                    </Button>
                  </div>
                </div>

                <FormDescription
                  className={cn(!isValidBid && "text-destructive")}
                >
                  Minimum bid: Rp {formatAmount(minBid)}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isValidBid}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing Bid...
              </>
            ) : (
              `Place Bid: Rp ${formatAmount(currentAmount || 0)}`
            )}
          </Button>
        </form>
      </Form>

      {/*
      {buyNowPrice && (
        <>
          <Button
            className="mt-2 w-full"
            variant="secondary"
            onClick={() => setIsBuyNowDialogOpen(true)}
          >
            Buy Now: Rp {formatAmount(buyNowPrice)}
          </Button>

          <Dialog
            open={isBuyNowDialogOpen}
            onOpenChange={setIsBuyNowDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Buy Now</DialogTitle>
              </DialogHeader>
              <p>
                Are you sure you want to buy this item for Rp{" "}
                {formatAmount(buyNowPrice)}?
              </p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsBuyNowDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await handleBuyNow();
                    setIsBuyNowDialogOpen(false);
                  }}
                  disabled={isBuyNowLoading}
                >
                  {isBuyNowLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Buy Now"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
      */}
    </>
  );
};

export default PlaceBidForm;
