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

type DeleteDialogProps = {
  token: string;
  auction_id: string;
  koiId: string;
  children?: React.ReactNode;
};

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  token,
  auction_id,
  koiId,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const { handleDeleteAuction, pendingDelete } = useAuctionDialog(
    { token },
    () => setOpen(false),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-destructive focus:text-destructive"
        >
          {children}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Auction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this auction? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteAuction(auction_id, koiId)}
            disabled={pendingDelete}
          >
            {pendingDelete ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
