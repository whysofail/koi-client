"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Wallet,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import useJoinAuctionDialogViewModel from "./JoinAuctionDialog.viewModel";

interface JoinAuctionDialogProps {
  token: string;
  auctionID: string;
  auctionTitle?: string;
  participationFee?: number;
  walletBalance?: number;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function JoinAuctionDialog({
  token,
  auctionID,
  auctionTitle = "this auction",
  participationFee = 50000, // Default participation fee in Rp
  walletBalance = 500000, // Default wallet balance in Rp
  trigger,
  onSuccess,
}: JoinAuctionDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<
    "details" | "confirmation" | "processing" | "result"
  >("details");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { handleJoinAuction } = useJoinAuctionDialogViewModel(token, auctionID);

  const finalBalance = walletBalance - participationFee;
  const hasInsufficientFunds = finalBalance < 0;

  const resetDialog = () => {
    setStep("details");
    setStatus("idle");
    setErrorMessage("");
  };

  const handleConfirm = () => {
    if (hasInsufficientFunds) return;
    setStep("confirmation");
  };

  const handleJoin = async () => {
    setStep("processing");
    setStatus("loading");

    try {
      await handleJoinAuction();
      setStatus("success");
      setStep("result");

      // Close dialog after success with a small delay
      setTimeout(() => {
        setOpen(false);
        resetDialog();
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (error) {
      setStatus("error");
      setStep("result");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to join auction",
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset the dialog state after it's closed
    setTimeout(resetDialog, 300);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) setTimeout(resetDialog, 300);
      }}
    >
      <DialogTrigger asChild>
        {trigger || <Button>Join Auction</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Join {auctionTitle}</DialogTitle>
              <DialogDescription>
                Review the participation details and fees before joining this
                auction.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-lg border p-4">
                <h4 className="mb-3 flex items-center font-medium">
                  <Wallet className="mr-2 h-4 w-4" />
                  Participation Fee
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Your Wallet Balance:</span>
                    <span className="font-medium">
                      Rp. {walletBalance.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Participation Fee:</span>
                    <span className="font-medium text-red-500">
                      - Rp. {participationFee.toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span>Final Balance:</span>
                    <span
                      className={`font-bold ${hasInsufficientFunds ? "text-red-500" : "text-green-600"}`}
                    >
                      Rp. {finalBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                {hasInsufficientFunds && (
                  <Alert variant="destructive" className="mt-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Insufficient Funds</AlertTitle>
                    <AlertDescription>
                      You don&apos;t have enough balance to join this auction.
                      Please add funds to your wallet.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="rounded-lg border p-4 text-sm">
                <h4 className="mb-2 font-medium">Auction Rules:</h4>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Each new bid must be equal to or higher than the minimum bid
                    increment.
                  </li>
                  <li>
                    All bids are final and cannot be changed or withdrawn.
                  </li>
                  <li>
                    You are allowed to place a higher bid even if you are
                    already the highest bidder
                  </li>
                  <li>
                    The highest bidder at the end of the auction will be
                    declared the winner
                  </li>
                  <li>
                    The winning bidder must complete the payment within 24 hours
                    after the auction ends.{" "}
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              {hasInsufficientFunds ? (
                <Link href="/dashboard/transactions/deposit">
                  <Button
                    variant="default"
                    className="mt-2 bg-green-600 hover:bg-green-700 sm:mt-0"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Funds
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleConfirm}
                  className="mt-2 sm:mt-0"
                  variant="default"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </DialogFooter>
          </>
        )}

        {step === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Participation</DialogTitle>
              <DialogDescription>
                Please confirm that you want to join this auction. The
                participation fee will be deducted from your wallet.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Auction:</span>
                  <span className="font-medium">{auctionTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Your Wallet Balance:</span>
                  <span className="font-medium">
                    Rp. {walletBalance.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Participation Fee:</span>
                  <span className="font-medium">
                    Rp. {participationFee.toLocaleString()}
                  </span>
                </div>

                <Separator />
                <div className="flex items-center justify-between">
                  <span>Balance After Deduction:</span>
                  <span className="font-bold text-green-600">
                    Rp. {finalBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
              <Button variant="outline" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={handleJoin} className="mt-2 sm:mt-0">
                Confirm & Join
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="mt-4 text-lg font-medium">
              Processing Your Request
            </h3>
            <p className="mt-2 text-center text-muted-foreground">
              Please wait while we process your participation request and deduct
              the fee from your wallet.
            </p>
          </div>
        )}

        {step === "result" && (
          <>
            <DialogHeader>
              <DialogTitle>
                {status === "success" ? "Successfully Joined" : "Error"}
              </DialogTitle>
              <DialogDescription>
                {status === "success"
                  ? "You have successfully joined the auction and can now place bids."
                  : "There was an error processing your request."}
              </DialogDescription>
            </DialogHeader>

            {status === "error" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMessage ||
                    "There was an error joining the auction. Please try again."}
                </AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>

                  <div className="mt-4 w-full rounded-lg border bg-muted/50 p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Participation Fee:</span>
                        <span className="font-medium text-red-500">
                          - Rp. {participationFee.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Previous Balance:</span>
                        <span className="font-medium">
                          Rp. {walletBalance.toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span>New Balance:</span>
                        <span className="font-bold">
                          Rp. {finalBalance.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  You will be redirected back to the auction page in a moment.
                </p>
              </>
            )}

            <DialogFooter>
              <Button
                onClick={handleClose}
                variant={status === "success" ? "outline" : "default"}
                className="w-full"
              >
                {status === "success" ? "Close" : "Try Again"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
