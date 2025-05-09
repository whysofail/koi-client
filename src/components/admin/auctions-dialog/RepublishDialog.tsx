import React, { useRef, useState, useEffect } from "react";
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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CalendarIcon, Loader2, Upload } from "lucide-react";
import { FormHandle } from "@/types/global.types";
import KoiAuctionForm from "@/components/admin/koi-auction-form/KoiAuctionForm";
import { useAuctionDialog } from "./AuctionDialog.viewModel";
import TimeInputWithWraparound from "@/components/ui/time-input-with-wraparound";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary";

type RepublishDialogProps = {
  token: string;
  auction_id: string;
  koiId: string;
  bid_increment: string;
  buynow_price: string;
  children?: React.ReactNode;
  button?: boolean;
  start_datetime?: string;
  end_datetime?: string;
};

const RepublishDialog: React.FC<RepublishDialogProps> = ({
  token,
  auction_id,
  bid_increment,
  buynow_price,
  children,
  button = false,
  start_datetime,
  end_datetime,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const formRef = useRef<FormHandle>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  // Store auction form data for later submission
  const [auctionFormData, setAuctionFormData] = useState<any>(null);

  const { form, handlePublishAuction, pendingUpdate } = useAuctionDialog(
    { token, start_datetime, end_datetime },
    () => {
      setOpen(false);
      setStep(1);
    },
  );

  // Handle dialog close attempt
  const handleOpenChange = (newOpen: boolean) => {
    // Prevent closing during submission
    if (!newOpen && isSubmitting) {
      return;
    }

    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when dialog closes
      setStep(1);
      setIsSubmitting(false);
      setAuctionFormData(null);
    }
  };

  // Update the moveToStep2 function in RepublishDialog.tsx
  const moveToStep2 = async () => {
    try {
      if (formRef.current) {
        // First, validate the form
        const isValid = await formRef.current.validateForm();

        if (isValid) {
          // Get and log the form data to confirm it's being captured
          const data = formRef.current.getValues();
          console.log("Form data captured:", data);

          if (!data) {
            toast.error("Failed to retrieve form data");
            return;
          }

          // Set auction data BEFORE changing the step
          setAuctionFormData(data);

          // Wait for state update to complete before changing step
          setTimeout(() => {
            console.log("Moving to step 2 with data:", data);
            setStep(2);
          }, 100); // Use a slightly longer timeout
        } else {
          toast.error("Please correct the form errors before proceeding");
        }
      } else {
        toast.error("Form reference not available");
      }
    } catch (error) {
      console.error("Form validation failed:", error);
      toast.error(
        `Error during validation: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // This handler will prevent default form submission
  const preventFormSubmission = React.useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Add this effect to capture form submissions inside the dialog
  useEffect(() => {
    const dialogContent = dialogContentRef.current;
    if (!dialogContent) return;

    const forms = dialogContent.querySelectorAll("form");
    forms.forEach((form) => {
      form.addEventListener("submit", preventFormSubmission as EventListener);
    });

    return () => {
      forms.forEach((form) => {
        form.removeEventListener(
          "submit",
          preventFormSubmission as EventListener,
        );
      });
    };
  }, [preventFormSubmission]);

  const ErrorFallback: React.FC<{
    error: Error;
    resetErrorBoundary: () => void;
  }> = ({ error, resetErrorBoundary }) => {
    return (
      <div role="alert" className="rounded border border-red-500 p-4">
        <p className="font-bold text-red-500">Something went wrong:</p>
        <pre className="overflow-auto text-sm">{error.message}</pre>
        <button
          onClick={resetErrorBoundary}
          className="mt-2 rounded bg-red-500 px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    );
  };

  // Add this function for manual submissions - Updated to remove unnecessary parameters
  const handleManualSubmission = async (
    startDateTime: Date,
    endDateTime: Date,
  ) => {
    try {
      if (!auctionFormData) {
        console.error("Missing auction data in submission handler");
        toast.error("Missing koi auction form data");
        return;
      }

      // Debug the date objects to ensure they're valid
      console.log("Date Objects:", {
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      });

      setIsSubmitting(true);
      console.log("is Form ref.current valid?", formRef.current);
      console.log("Auction form data:", auctionFormData);
      try {
        // Skip first submission if form ref is not available
        if (formRef.current) {
          try {
            // Step 1: Submit auction form data
            await formRef.current.submitWithData(auctionFormData);
          } catch (error) {
            console.error("Error updating auction details:", error);
            toast.error("Failed to update auction details");
            // Continue with publishing even if updating details fails
          }
        }

        // Step 2: Publish auction with dates
        await handlePublishAuction(
          auction_id,
          // Get these values from auctionFormData or fall back to props
          auctionFormData.bid_increment || bid_increment,
          auctionFormData.buynow_price || buynow_price,
          startDateTime,
          endDateTime,
        );

        toast.success("Auction published successfully");

        // Force a router refresh to ensure the UI updates
        // This is a backup in case the query invalidation doesn't trigger a UI update
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000);

        setOpen(false);
      } catch (error) {
        console.error("Submission failed:", error);
        toast.error(
          `Failed to process auction: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to publish auction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modal={true}>
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

      <DialogContent
        aria-describedby="dialog-description"
        ref={dialogContentRef}
        className="h-5/6 max-w-fit overflow-y-auto"
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Update Auction Details" : "Set Publish Dates"}
          </DialogTitle>
        </DialogHeader>

        {/* Keep KoiAuctionForm mounted but hidden when not in step 1 */}
        <div style={{ display: step === 1 ? "block" : "none" }}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <div>
              <KoiAuctionForm
                ref={formRef}
                token={token}
                id={auction_id}
                operation="republish"
                submitButton={null}
              />

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  onClick={moveToStep2}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              </DialogFooter>
            </div>
          </ErrorBoundary>
        </div>

        {/* Step 2 form */}
        <div style={{ display: step === 2 ? "block" : "none" }}>
          {!auctionFormData ? (
            <div className="py-4 text-center">
              <p className="text-red-500">
                Missing auction data, please go back and try again
              </p>
              <Button onClick={() => setStep(1)} className="mt-2">
                Back to step 1
              </Button>
            </div>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={(e) => e.preventDefault()}>
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
                                    "dd-MM-yyyy",
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                className="w-auto p-0"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value || new Date()}
                                  onSelect={(date) => {
                                    if (date) {
                                      const newDate = new Date(date);
                                      const currentValue =
                                        field.value || new Date();
                                      newDate.setHours(currentValue.getHours());
                                      newDate.setMinutes(
                                        currentValue.getMinutes(),
                                      );
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
                              onChange={(time) => {
                                const [hours, minutes] = time
                                  .split(":")
                                  .map(Number);
                                const newDate = new Date(
                                  field.value || new Date(),
                                );
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                              }}
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
                                    "dd-MM-yyyy",
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                className="w-auto p-0"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value || new Date()}
                                  onSelect={(date) => {
                                    if (date) {
                                      const newDate = new Date(date);
                                      const currentValue =
                                        field.value || new Date();
                                      newDate.setHours(currentValue.getHours());
                                      newDate.setMinutes(
                                        currentValue.getMinutes(),
                                      );
                                      field.onChange(newDate);
                                    }
                                  }}
                                  disabled={(date) => {
                                    const startDate =
                                      form.getValues("startDateTime");
                                    return date < startDate;
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <TimeInputWithWraparound
                              value={format(field.value || new Date(), "HH:mm")}
                              onChange={(time) => {
                                const [hours, minutes] = time
                                  .split(":")
                                  .map(Number);
                                const newDate = new Date(
                                  field.value || new Date(),
                                );
                                newDate.setHours(hours, minutes);
                                field.onChange(newDate);
                              }}
                              className="flex-shrink-0"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={async () => {
                    // Validate the form first
                    const isValid = await form.trigger();
                    if (!isValid) {
                      return; // Stop if validation fails
                    }

                    const { startDateTime, endDateTime } = form.getValues();

                    // Call final submission with form values
                    handleManualSubmission(startDateTime, endDateTime);
                  }}
                  disabled={isSubmitting || pendingUpdate}
                >
                  {isSubmitting || pendingUpdate ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Auction"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepublishDialog;
