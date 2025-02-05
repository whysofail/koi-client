"use client";

import React, { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertTriangle } from "lucide-react";

const formSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

interface WarnUserDialogProps {
  onWarn: (reason: string) => void;
  isWarning: boolean;
}

const WarnUserDialog: FC<WarnUserDialogProps> = ({ onWarn, isWarning }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onWarn(values.reason);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Warn User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Warn User</DialogTitle>
          <DialogDescription>
            Provide a reason for warning this user.
          </DialogDescription>
          <DialogDescription>
            Third consecutive warning will result in a ban.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter warning reason..."
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isWarning}>
              {isWarning ? "Warning..." : "Submit Warning"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default WarnUserDialog;
