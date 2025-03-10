"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePlaceBidForm } from "./PlaceBidForm.viewModel";

interface PlaceBidFormProps {
  token: string;
  auctionID: string;
  currentBid: number;
  minIncrement: number;
  isEnded: boolean;
}

const PlaceBidForm = ({
  token,
  auctionID,
  currentBid,
  minIncrement,
  isEnded,
}: PlaceBidFormProps) => {
  const { form, isSubmitting, minBid, onSubmit } = usePlaceBidForm(
    token,
    auctionID,
    currentBid,
    minIncrement,
  );

  if (isEnded) {
    return (
      <Button className="w-full" disabled>
        Auction Ended
      </Button>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter bid amount"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Minimum bid: Rp. {minBid.toLocaleString()}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || form.watch("amount") < minBid}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Placing Bid...
            </>
          ) : (
            "Place Bid"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PlaceBidForm;
