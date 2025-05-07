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
import { useAuctionDialog } from "./AuctionDialog.viewModel";

type UnpublishDialogProps = {
  token: string;
  auction_id: string;
  koiId: string;
  children?: React.ReactNode;
};

const UnpublishDialog: React.FC<UnpublishDialogProps> = ({
  token,
  auction_id,
  koiId,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const { handleUnpublishAuction } = useAuctionDialog({ token }, () =>
    setOpen(false),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {children}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unpublish Auction</DialogTitle>
          <DialogDescription>
            Are you sure you want to unpublish this auction? This will move the
            auction back to draft status and allow you to modify its details.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Go Back
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleUnpublishAuction(auction_id, koiId)}
          >
            Unpublish Auction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnpublishDialog;
