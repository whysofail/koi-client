"use client";

import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Ban, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminControlsViewModel from "./AdminControls.viewModel";
import { AuctionStatus } from "@/types/auctionTypes";
import { useRouter } from "next/navigation";

type AdminControlsProps = {
  auctionId: string;
  bid_increment: string;
  buynow_price: string;
  koiId: string;
  token: string;
  auctionStatus: AuctionStatus;
};

const AdminControls: FC<AdminControlsProps> = ({
  auctionId,
  bid_increment,
  buynow_price,
  koiId,
  token,
  auctionStatus,
}) => {
  const { handleCancelAuction, pendingCancel, open, setOpen } =
    AdminControlsViewModel(token);

  const router = useRouter();

  return (
    <div className="mb-3 mt-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Auction Management
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <AlertDialog open={open} onOpenChange={setOpen}>
          {auctionStatus !== AuctionStatus.CANCELLED ||
            (AuctionStatus.DRAFT && (
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Ban className="mr-2 h-4 w-4" />
                  Cancel Auction
                </Button>
              </AlertDialogTrigger>
            ))}
          {auctionStatus === AuctionStatus.DRAFT && (
            <Button
              onClick={() =>
                router.push(
                  `/dashboard/auctions/update/${auctionId}?koiID=${koiId}`,
                )
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Auction
            </Button>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately cancel the auction and notify all
                participants. This action cannot be reversed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleCancelAuction(
                    auctionId,
                    bid_increment,
                    buynow_price,
                    koiId,
                  );
                }}
                disabled={pendingCancel}
              >
                {pendingCancel ? "Processing..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminControls;
