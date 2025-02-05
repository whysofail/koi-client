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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface TransactionFiltersProps {
  onApply: (filters: TransactionFilters) => void;
  initialFilters?: TransactionFilters;
}

export default function TransactionFilters({
  onApply,
  initialFilters,
}: TransactionFiltersProps) {
  const [filters, setFilters] = useState<TransactionFilters>(
    initialFilters || {},
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field: keyof TransactionFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({});
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
                <Badge
                  key={type}
                  variant={filters.type === type ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleChange("type", type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Transaction Statuses</Label>
          <div className="flex flex-wrap gap-2">
            {Object.values(TransactionStatus).map((status) => (
              <Badge
                key={status}
                variant={filters.status === status ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleChange("status", status)}
              >
                {status}
              </Badge>
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
                  {order}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Select
            value={filters.order || "desc"}
            defaultValue="desc"
            onValueChange={(value) => handleChange("order", value)}
          >
            <SelectTrigger id="order">
              <SelectValue placeholder="Select order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
