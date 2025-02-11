import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import usePlaceBid from "@/server/bid/placeBidOnAuction/mutations";

const formSchema = z.object({
  amount: z.number().min(1, "Bid amount is required"),
});

export type PlaceBidFormData = z.infer<typeof formSchema>;

export function usePlaceBidForm(
  token: string,
  auctionID: string,
  currentBid: number,
  minIncrement: number,
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const minBid = currentBid === 0 ? minIncrement : currentBid + minIncrement;

  const queryClient = useQueryClient();

  const placeBidMutation = usePlaceBid(token, queryClient);

  const form = useForm<PlaceBidFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: minBid,
    },
  });

  const onSubmit = (values: PlaceBidFormData) => {
    setIsSubmitting(true);
    placeBidMutation.mutate(
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

  return {
    form,
    isSubmitting,
    minBid,
    onSubmit,
  };
}
