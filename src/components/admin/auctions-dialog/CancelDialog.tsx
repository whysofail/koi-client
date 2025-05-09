"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import { useAuctionDialog } from "./AuctionDialog.viewModel";

type CancelDialogProps = {
  token: string;
  auction_id: string;
  koiId: string;
  bid_increment: string;
  buynow_price: string;
  children?: React.ReactNode;
};

const CancelDialog: React.FC<CancelDialogProps> = ({
  token,
  auction_id,
  koiId,
  bid_increment,
  buynow_price,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const { handleCancelAuction, pendingCancel } = useAuctionDialog(
    { token },
    () => setOpen(false),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {children}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Auction</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this auction? This will make the
            auction unavailable to users and return the Koi to available status.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Go Back
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              handleCancelAuction(
                auction_id,
                bid_increment,
                buynow_price,
                koiId,
              )
            }
            disabled={pendingCancel}
          >
            {pendingCancel ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Auction"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelDialog;
