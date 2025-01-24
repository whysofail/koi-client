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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import KoiAuctionFormViewModel from "./KoiAuctionForm.viewModel";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const KoiAuctionForm: FC<{ token: string; koiID: string }> = ({
  token,
  koiID,
}) => {
  const {
    form,
    onSubmit,
    formatDate,
    updateDateTime,
    isPending,
    formatCurrency,
  } = KoiAuctionFormViewModel(token, koiID);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border p-4">
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
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Koi Item ID</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
              name="start_datetime"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="text-foreground">
                    Start Date Time
                  </FormLabel>
                  <div className="flex w-full flex-col gap-2 sm:flex-row">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            updateDateTime(
                              date,
                              new Date(field.value || Date.now())
                                .getHours()
                                .toString()
                                .padStart(2, "0") +
                                ":" +
                                new Date(field.value || Date.now())
                                  .getMinutes()
                                  .toString()
                                  .padStart(2, "0"),
                              field.onChange,
                            )
                          }
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Select
                      onValueChange={(time) =>
                        updateDateTime(
                          field.value ? new Date(field.value) : new Date(),
                          time,
                          field.onChange,
                        )
                      }
                      defaultValue={
                        field.value
                          ? new Date(field.value)
                              .getHours()
                              .toString()
                              .padStart(2, "0") +
                            ":" +
                            new Date(field.value)
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 24 * 4 }, (_, i) => {
                          const hour = Math.floor(i / 4);
                          const minute = (i % 4) * 15;
                          return `${hour.toString().padStart(2, "0")}:${minute
                            .toString()
                            .padStart(2, "0")}`;
                        }).map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {!form.formState.errors.start_datetime && (
                    <FormDescription>
                      The date and time when the auction will start
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_datetime"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel className="text-foreground">
                    End Date Time
                  </FormLabel>
                  <div className="flex w-full flex-col gap-2 sm:flex-row">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            updateDateTime(
                              date,
                              new Date(field.value || Date.now())
                                .getHours()
                                .toString()
                                .padStart(2, "0") +
                                ":" +
                                new Date(field.value || Date.now())
                                  .getMinutes()
                                  .toString()
                                  .padStart(2, "0"),
                              field.onChange,
                            )
                          }
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Select
                      onValueChange={(time) =>
                        updateDateTime(
                          field.value ? new Date(field.value) : new Date(),
                          time,
                          field.onChange,
                        )
                      }
                      defaultValue={
                        field.value
                          ? new Date(field.value)
                              .getHours()
                              .toString()
                              .padStart(2, "0") +
                            ":" +
                            new Date(field.value)
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 24 * 4 }, (_, i) => {
                          const hour = Math.floor(i / 4);
                          const minute = (i % 4) * 15;
                          return `${hour.toString().padStart(2, "0")}:${minute
                            .toString()
                            .padStart(2, "0")}`;
                        }).map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {!form.formState.errors.end_datetime && (
                    <FormDescription>
                      The date and time when the auction will end
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
                      The minimum price at which the auction will start
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
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
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
