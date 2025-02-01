import React, { FC } from "react";
import {
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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { formatDate, updateDateTime } from "./DatetimePicker.viewModel";

interface DatetimePickerProps {
  form: UseFormReturn<any>;
  name: "start_datetime" | "end_datetime";
  label: string;
  description: string;
}

const DatetimePicker: FC<DatetimePickerProps> = ({
  form,
  name,
  label,
  description,
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="text-foreground">{label}</FormLabel>
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
                  selected={field.value ? new Date(field.value) : undefined}
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
                  disabled={(date) => {
                    const now = new Date();
                    const today = new Date(
                      now.getFullYear(),
                      now.getMonth(),
                      now.getDate(),
                    );
                    return date < today || date < new Date("1900-01-01");
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-1">
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={23}
                  className="w-[70px]"
                  placeholder="HH"
                  value={
                    field.value
                      ? new Date(field.value)
                          .getHours()
                          .toString()
                          .padStart(2, "0")
                      : ""
                  }
                  onChange={(e) => {
                    const hours = Math.min(
                      23,
                      Math.max(0, Number(e.target.value)),
                    );
                    const minutes = field.value
                      ? new Date(field.value).getMinutes()
                      : 0;
                    updateDateTime(
                      field.value ? new Date(field.value) : new Date(),
                      `${hours.toString().padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}`,
                      field.onChange,
                    );
                  }}
                />
              </FormControl>
              <span className="text-foreground">:</span>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={59}
                  className="w-[70px]"
                  placeholder="mm"
                  value={
                    field.value
                      ? new Date(field.value)
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")
                      : ""
                  }
                  onChange={(e) => {
                    const minutes = Math.min(
                      59,
                      Math.max(0, Number(e.target.value)),
                    );
                    const hours = field.value
                      ? new Date(field.value).getHours()
                      : 0;
                    updateDateTime(
                      field.value ? new Date(field.value) : new Date(),
                      `${hours.toString().padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}`,
                      field.onChange,
                    );
                  }}
                />
              </FormControl>
            </div>
          </div>
          {!form.formState.errors[name] && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatetimePicker;
