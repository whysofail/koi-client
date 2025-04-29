import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import usePlaceBid from "@/server/bid/placeBidOnAuction/mutations";
import { useCreateBuyNow } from "@/server/auction/createBuyNow/mutation";

const formSchema = z.object({
  amount: z.number().min(1, "Bid amount is required"),
});

export type PlaceBidFormData = z.infer<typeof formSchema>;

export function usePlaceBidForm(
  token: string,
  auctionID: string,
  currentBid: number,
  minIncrement: number,
  bidStartingPrice: number,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minBid = currentBid > 0 ? currentBid + minIncrement : bidStartingPrice;

  const queryClient = useQueryClient();

  const { mutateAsync: placeBidMutation, isError } = usePlaceBid(
    token,
    queryClient,
  );
  const {
    mutateAsync: buyNowMutation,
    isPending: isBuyNowLoading,
    isError: isBuyNowError,
  } = useCreateBuyNow(token, queryClient);

  const form = useForm<PlaceBidFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: minBid,
    },
  });

  const onSubmit = (values: PlaceBidFormData) => {
    setIsSubmitting(true);
    placeBidMutation(
      {
        auctionID,
        bid_amount: values.amount,
      },
      {
        onSuccess: () => {
          toast.success("Bid placed successfully!");
          form.reset({ amount: values.amount + minIncrement });
          setIsSubmitting(false);
        },
        onError: (error) => {
          toast.error(error.message);
          console.error("Failed to place bid:", error);
          setIsSubmitting(false);
        },
      },
    );
  };

  const handleBuyNow = async () => {
    setIsSubmitting(true);
    try {
      await buyNowMutation({ auctionId: auctionID });
      toast.success("Buy now request placed!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(errorMessage);
      console.error("Failed to buy now:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    minBid,
    onSubmit,
    isError,
    handleBuyNow,
    isBuyNowLoading,
    isBuyNowError,
  };
}
