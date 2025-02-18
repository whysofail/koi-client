"use client";

import { useState } from "react";
import { CalendarIcon, CirclePlusIcon as PlusCircledIcon } from "lucide-react";
import { format } from "date-fns";
import {
  TransactionStatus,
  TransactionType,
  TransactionOrderBy,
  type TransactionFilters,
} from "@/types/transactionTypes";
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
import TypeBadge from "./TypeBadge";
import normalizeString from "@/lib/formatString";

interface TransactionFiltersProps {
  onApply: (filters: TransactionFilters) => void;
  onReset: () => void;
  initialFilters?: TransactionFilters;
}

export default function TransactionFilters({
  onApply,
  onReset,
  initialFilters,
}: TransactionFiltersProps) {
  const [filters, setFilters] = useState<TransactionFilters>({
    order: "DESC",
    ...initialFilters,
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field: keyof TransactionFilters, value: any) => {
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
          <AlertDialogTitle>Filter Transactions</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!filters.createdAtFrom && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.createdAtFrom
                      ? format(filters.createdAtFrom, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filters.createdAtFrom
                        ? new Date(filters.createdAtFrom)
                        : undefined
                    }
                    onSelect={(date) => handleChange("createdAtFrom", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!filters.createdAtTo && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.createdAtTo
                      ? format(filters.createdAtTo, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      filters.createdAtTo
                        ? new Date(filters.createdAtTo)
                        : undefined
                    }
                    onSelect={(date) => handleChange("createdAtTo", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Transaction Types</Label>
            <div className="flex flex-wrap gap-2">
              {Object.values(TransactionType).map((type) => (
                <TypeBadge
                  key={type}
                  type={type}
                  selected={filters.type === type}
                  className="cursor-pointer"
                  onClick={() => handleChange("type", type)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Transaction Status</Label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TransactionStatus).map((status) => (
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
              {Object.values(TransactionOrderBy).map((order) => (
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
