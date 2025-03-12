"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { useUpdateAuction } from "@/server/auction/updateAuction/mutations";
import { AuctionStatus, Bid } from "@/types/auctionTypes";
import { toast } from "sonner";
import useUpdateKoi from "@/server/koi/updateKoi/mutations";
import { KoiStatus } from "@/types/koiTypes";

export const useVerifyAuctionViewModel = (auctionId: string, token: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGetAuctionByID(auctionId, token, {
    enabled: !!token,
  });

  const { mutate, isPending } = useUpdateAuction(token, queryClient);
  const { mutateAsync: updateKoiStatus, isPending: pendingUpdateKoiStatus } =
    useUpdateKoi(queryClient);

  // Local state
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [bidToConfirm, setBidToConfirm] = useState<Bid | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const auction = data?.data?.[0];

  const handleSelectBid = useCallback((bid: Bid) => {
    setBidToConfirm(bid);
    setDialogOpen(true);
  }, []);

  const handleVerifyWinner = useCallback(() => {
    if (!bidToConfirm || !auctionId || !auction) {
      setDialogOpen(false);
      return;
    }

    const koiId = auction.item;

    // First update koi status with Promise wrapper
    new Promise<boolean>((resolve, reject) => {
      updateKoiStatus(
        {
          koiId,
          koiStatus: KoiStatus.SOLD,
          buyerName: bidToConfirm.user.username,
        },
        {
          onSuccess: () => resolve(true),
          onError: reject,
        },
      );
    })
      .then((koiUpdateResult) => {
        // Only proceed with auction update if koi update succeeded
        if (koiUpdateResult) {
          mutate(
            {
              auctionId,
              data: {
                winner_id: bidToConfirm.user.user_id,
                final_price: bidToConfirm.bid_amount,
                status: AuctionStatus.COMPLETED,
              },
            },
            {
              onSuccess: () => {
                setSelectedBid(bidToConfirm);
                setUpdateSuccess(true);
                setDialogOpen(false);
                toast.success("Winner verified successfully");

                queryClient.invalidateQueries({
                  queryKey: ["auction", auctionId],
                });
                queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
                queryClient.invalidateQueries({ queryKey: ["koiData"] });
              },
              onError: (error) => {
                const errorMessage =
                  error instanceof Error
                    ? error.message
                    : "Failed to update auction";
                setUpdateError(errorMessage);
                toast.error(errorMessage);
              },
              onSettled: () => {
                if (dialogOpen) {
                  setDialogOpen(false);
                }
              },
            },
          );
        }
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update koi status";
        setUpdateError(errorMessage);
        toast.error(errorMessage);
        if (dialogOpen) {
          setDialogOpen(false);
        }
      });
  }, [
    auctionId,
    bidToConfirm,
    dialogOpen,
    mutate,
    queryClient,
    auction,
    updateKoiStatus,
  ]);

  return {
    auction,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
    selectedBid,
    bidToConfirm,
    handleSelectBid,
    handleVerifyWinner,
    isUpdating: isPending || pendingUpdateKoiStatus,
    updateSuccess,
    updateError,
    dialogOpen,
    setDialogOpen,
  };
};
