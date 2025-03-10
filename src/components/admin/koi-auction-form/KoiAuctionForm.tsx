"use client";

import React, { FC } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import KoiAuctionFormViewModel from "./KoiAuctionForm.viewModel";
import { AuctionStatus } from "@/types/auctionTypes";
import { MinimalTiptapEditor } from "@/components/shared/minimal-tiptap";
import { cn } from "@/lib/utils";

type KoiAuctionFormProps = {
  token: string;
  id: string;
  operation: "create" | "update";
  initialData?: {
    title: string;
    description: string;
    rich_description: string;
    item: string;
    reserve_price: number;
    participation_fee: number;
    bid_increment: number;
    status: AuctionStatus;
  };
};

const KoiAuctionForm: FC<KoiAuctionFormProps> = ({
  token,
  id,
  operation,
  initialData,
}) => {
  const {
    form,
    onSubmit,
    pendingCreate: isSubmitting,
    pendingUpdate,
    formatCurrency,
    isUpdate,
  } = KoiAuctionFormViewModel(token, id, operation, initialData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border p-4 dark:border-neutral-700">
          <h2 className="font-semibold">Auction Details</h2>
          <div className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Auction Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter auction title"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  {!form.formState.errors.title && (
                    <FormDescription>A title for the auction</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">
                    Auction Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter auction description"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  {!form.formState.errors.description && (
                    <FormDescription>
                      A short description of the auction
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rich_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Description</FormLabel>
                  <FormControl>
                    <MinimalTiptapEditor
                      {...field}
                      throttleDelay={0}
                      className={cn("h-full min-h-56 w-full rounded-xl", {
                        "border-destructive focus-within:border-destructive":
                          form.formState.errors.description,
                      })}
                      editorContentClassName="overflow-auto h-full flex grow"
                      placeholder="Type your description here..."
                      editable={true}
                      editorClassName="focus:outline-none px-5 py-4 h-full grow"
                      immediatelyRender={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Koi Item ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled
                    />
                  </FormControl>
                  {!form.formState.errors.item && (
                    <FormDescription>
                      The ID of the Koi Item to be auctioned
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reserve_price"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-foreground">
                    Reserve Price
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        Rp
                      </span>
                      <Input
                        type="text"
                        placeholder="Enter reserve price"
                        {...field}
                        className="pl-9"
                        value={
                          field.value === 0 ? "" : formatCurrency(field.value)
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, "");
                          if (/^\d*$/.test(value)) {
                            field.onChange(Number(value));
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  {!form.formState.errors.reserve_price && (
                    <FormDescription>
                      The buy now price for the auction
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="participation_fee"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-foreground">
                    Participation Fee
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        Rp
                      </span>
                      <Input
                        type="text"
                        placeholder="Enter participation fee"
                        {...field}
                        className="pl-9"
                        value={
                          field.value === 0 ? "" : formatCurrency(field.value)
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, "");
                          if (/^\d*$/.test(value)) {
                            field.onChange(Number(value));
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  {!form.formState.errors.participation_fee && (
                    <FormDescription>
                      The participation fee for the user to join auction
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bid_increment"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-foreground">
                    Bid Increment
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        Rp
                      </span>
                      <Input
                        type="text"
                        placeholder="Enter bid increment"
                        {...field}
                        className="pl-9"
                        value={
                          field.value === 0 ? "" : formatCurrency(field.value)
                        }
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, "");
                          if (/^\d*$/.test(value)) {
                            field.onChange(Number(value));
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  {!form.formState.errors.bid_increment && (
                    <FormDescription>
                      The minimum amount that must be added to the current bid
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* {operation === "update" && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Auction Status
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select auction status" />
                        </SelectTrigger>
                        <SelectContent>
                          {allowedStatuses.map((status) => (
                            <SelectItem
                              key={status}
                              value={status}
                              disabled={status === field.value}
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    {!form.formState.errors.status && (
                      <FormDescription>
                        Select the current status of the auction
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isUpdate ? pendingUpdate : isSubmitting}
        >
          {isUpdate ? (
            pendingUpdate ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Auction...
              </>
            ) : (
              "Update Auction"
            )
          ) : isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding to Auction...
            </>
          ) : (
            "Add to Auction"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default KoiAuctionForm;
