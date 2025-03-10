"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { useUpdateAuction } from "@/server/auction/updateAuction/mutations";
import { Auction, AuctionStatus, Bid } from "@/types/auctionTypes";

export const useVerifyAuctionViewModel = (auctionId: string, token: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, error } = useGetAuctionByID(auctionId, token, {
    enabled: !!token,
  });
  const updateAuctionMutation = useUpdateAuction(token, queryClient);

  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Extract the auction from the response
  const auction = data?.data?.[0] as Auction | undefined;

  // Initialize selectedBid with the highest bid when data loads
  useEffect(() => {
    if (auction?.highest_bid) {
      setSelectedBid(auction.highest_bid);
    }
  }, [auction]);

  const handleSelectBid = (bid: Bid) => {
    setSelectedBid(bid);
    setUpdateError(null);
  };

  const handleVerifyWinner = async () => {
    if (!selectedBid || !auction) return;

    try {
      setUpdateError(null);

      // Prepare the update data
      const updateData = {
        winner_id: selectedBid.user.user_id,
        final_price: selectedBid.bid_amount,
        status: AuctionStatus.COMPLETED,
      };

      // Call the update mutation
      await updateAuctionMutation.mutateAsync({
        auctionId,
        data: updateData,
      });

      setUpdateSuccess(true);

      // Invalidate the auction query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["auction", auctionId] });

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/auctions");
      }, 2000);
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Failed to update auction",
      );
      setUpdateSuccess(false);
    }
  };

  return {
    auction,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
    selectedBid,
    handleSelectBid,
    handleVerifyWinner,
    isUpdating: updateAuctionMutation.isPending,
    updateSuccess,
    updateError,
  };
};
