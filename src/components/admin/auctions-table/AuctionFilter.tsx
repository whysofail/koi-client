"use client";

import { useState } from "react";
import { CalendarIcon, CirclePlusIcon as PlusCircledIcon } from "lucide-react";
import { format } from "date-fns";
import {
  AuctionStatus,
  type AuctionFilters,
  AuctionOrderBy,
} from "@/types/auctionTypes";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import StatusBadge from "./StatusBadge";
import normalizeString from "@/lib/formatString";

interface AuctionFiltersProps {
  onApply: (filters: AuctionFilters) => void;
  onReset: () => void;
  initialFilters?: AuctionFilters;
}

export default function AuctionFilters({
  onApply,
  onReset,
  initialFilters,
}: AuctionFiltersProps) {
  const [filters, setFilters] = useState<AuctionFilters>({
    order: "DESC",
    ...initialFilters,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field: keyof AuctionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({ order: "DESC" });
    setIsOpen(false);
    onReset();
  };

  const handleApply = () => {
    onApply(filters);
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Add Filter
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Filter Auction</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!filters.startDateFrom && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDateFrom
                      ? format(filters.startDateFrom, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filters.startDateFrom
                        ? new Date(filters.startDateFrom)
                        : undefined
                    }
                    onSelect={(date) => handleChange("startDateFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Start Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!filters.startDateTo && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDateTo
                      ? format(filters.startDateTo, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filters.startDateTo
                        ? new Date(filters.startDateTo)
                        : undefined
                    }
                    onSelect={(date) => handleChange("startDateTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Auction Type</Label>
          <div className="flex flex-wrap gap-2">
            {Object.values(AuctionStatus).map((status) => (
              <StatusBadge
                key={status}
                status={status}
                selected={filters.status === status}
                className="cursor-pointer"
                onClick={() => handleChange("status", status)}
              />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="orderBy">Order By</Label>
          <Select
            value={filters.orderBy || ""}
            onValueChange={(value) => handleChange("orderBy", value)}
          >
            <SelectTrigger id="orderBy">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(AuctionOrderBy).map((order) => (
                <SelectItem key={order} value={order}>
                  {/* Normalize to human readable string */}
                  {normalizeString(order)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Select
            value={filters.order}
            defaultValue="DESC"
            onValueChange={(value) => handleChange("order", value)}
          >
            <SelectTrigger id="order">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Descending</SelectItem>
              <SelectItem value="ASC">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between">
          <AlertDialogCancel asChild>
            <Button variant="outline">Close</Button>
          </AlertDialogCancel>
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
