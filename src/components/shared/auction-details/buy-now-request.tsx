"use client";

import { formatDistanceToNow } from "date-fns";
import type { AuctionBuyNow } from "@/types/auctionBuyNowTypes";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { AlertCircle, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBuyNowViewModel } from "./useBuyNow.viewModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface BuyNowHistoryProps {
  buyNowRequests?: AuctionBuyNow[];
  token: string;
  auctionId: string;
  showActionButton?: boolean;
}

export function BuyNowHistory({
  buyNowRequests,
  token,
  auctionId,
  showActionButton = true,
}: BuyNowHistoryProps) {
  if (!buyNowRequests || buyNowRequests.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-muted-foreground">No buy now requests yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-md">
      <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
        {buyNowRequests.map((request) => (
          <div
            key={request.auction_buynow_id}
            className="flex items-center space-x-3 border-b p-2 transition-colors last:border-b-0 hover:bg-slate-200/25"
          >
            <Link href={`/dashboard/users/${request.buyer?.user_id}`} passHref>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex items-center space-x-2">
                    <p className="truncate font-medium">
                      {request.buyer?.username ?? "Unknown User"}
                    </p>
                    <p className="text-sm">Requested Buy Now</p>
                  </div>
                </div>
              </div>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </TooltipTrigger>
                <TooltipContent sideOffset={0} side="top" align="start">
                  {new Date(request.created_at).toLocaleString()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {showActionButton && (
              <BuyNowActions
                buyNowId={request.auction_buynow_id}
                token={token}
                auctionId={auctionId}
                buyerName={request.buyer?.username ?? "Unknown User"}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface BuyNowActionsProps {
  buyNowId: string;
  token: string;
  auctionId: string;
  buyerName: string;
}

function BuyNowActions({ buyNowId, token, buyerName }: BuyNowActionsProps) {
  const { completeBuyNow, isCompleting } = useBuyNowViewModel(token);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleConfirm = async () => {
    await completeBuyNow(buyNowId);
    setDialogOpen(false);
  };

  return (
    <div className="flex space-x-2">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            Accept
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Confirm Buy Now Acceptance
            </DialogTitle>
            <DialogDescription>
              You are about to accept the buy now request from{" "}
              <span className="font-medium">{buyerName}</span>. This will end
              the auction immediately and award the item to this buyer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Once accepted, this action cannot be undone and all other bids
              will be invalidated.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isCompleting}>
              {isCompleting ? "Processing..." : "Confirm Acceptance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
