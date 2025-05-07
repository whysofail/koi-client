import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Upload } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TimeInputWithWraparound } from "@/components/ui/time-input-with-wraparound";
import { useAuctionDialog } from "./AuctionDialog.viewModel";

type PublishDialogProps = {
  token: string;
  auction_id: string;
  bid_increment: string;
  buynow_price: string;
  children?: React.ReactNode;
  button?: boolean;
  start_datetime?: string;
  end_datetime?: string;
};

const PublishDialog: React.FC<PublishDialogProps> = ({
  token,
  auction_id,
  bid_increment,
  buynow_price,
  children,
  button = false,
  start_datetime,
  end_datetime,
}) => {
  const [open, setOpen] = React.useState(false);

  const { form, handlePublishAuction, pendingUpdate } = useAuctionDialog(
    { token, start_datetime, end_datetime },
    () => setOpen(false),
  );

  const handleTimeChange = (time: string, field: any) => {
    const [hours, minutes] = time.split(":");
    const hoursNum = parseInt(hours, 10);
    const minutesNum = parseInt(minutes, 10);

    const newDate = new Date(field.value || new Date());
    newDate.setHours(hoursNum, minutesNum);
    field.onChange(newDate);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild>
        {button ? (
          <Button
            variant="outline"
            className="text-bold w-full bg-green-500 uppercase"
          >
            <Upload />
            Publish Auction
          </Button>
        ) : (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {children}
          </DropdownMenuItem>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Auction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Start Date and Time</FormLabel>
                  <div className="flex items-center gap-2">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {format(
                            field.value || new Date(),
                            "dd-MM-yyyy HH:mm",
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || new Date()}
                          onSelect={(date) => {
                            if (date) {
                              const newDate = new Date(date);
                              const currentValue = field.value || new Date();
                              newDate.setHours(currentValue.getHours());
                              newDate.setMinutes(currentValue.getMinutes());
                              field.onChange(newDate);
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <TimeInputWithWraparound
                      value={format(field.value || new Date(), "HH:mm")}
                      onChange={(time) => handleTimeChange(time, field)}
                      className="flex-shrink-0"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>End Date and Time</FormLabel>
                  <div className="flex items-center gap-2">
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {format(
                            field.value || new Date(),
                            "dd-MM-yyyy HH:mm",
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const newDate = new Date(date);
                              if (field.value) {
                                newDate.setHours(field.value.getHours());
                                newDate.setMinutes(field.value.getMinutes());
                              }
                              field.onChange(newDate);
                            }
                          }}
                          disabled={(date) => {
                            const startDate = form.getValues("startDateTime");
                            const startDay = startDate
                              ? new Date(startDate)
                              : new Date();
                            startDay.setHours(0, 0, 0, 0);

                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            return (
                              date < today || (startDate && date < startDay)
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <TimeInputWithWraparound
                      value={field.value ? format(field.value, "HH:mm") : ""}
                      onChange={(time) => handleTimeChange(time, field)}
                      className="flex-shrink-0"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(() =>
              handlePublishAuction(auction_id, bid_increment, buynow_price),
            )}
            disabled={pendingUpdate}
          >
            {pendingUpdate ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;
