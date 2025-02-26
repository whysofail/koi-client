"use client";

import React, { FC, useState } from "react";
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
import useDepositFormViewModel from "./DepositForm.viewModel";
import ImageUploadEditor from "@/app/(public-pages)/test/ImageDropZone";

type DepositFormProps = {
  token: string;
  initialData?: {
    amount: string;
    proofOfPayment: File | null;
  };
};

const DepositForm: FC<DepositFormProps> = ({ token, initialData }) => {
  const {
    form,
    onSubmit,
    pendingCreate: isSubmitting,
  } = useDepositFormViewModel(token, initialData);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setUploadedFileName(file.name);
    form.setValue("proofOfPayment", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleImageEdit = (file: File) => {
    setUploadedFile(file);
    setUploadedFileName("edited-" + uploadedFileName);
    form.setValue("proofOfPayment", file, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const formatCurrency = (value: string) => {
    // Format number with thousand separators
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border p-4 dark:border-neutral-700">
          <h2 className="font-semibold">Add Funds to Wallet</h2>
          <div className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-foreground">
                    Deposit Amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        Rp
                      </span>
                      <Input
                        type="text"
                        placeholder="Enter deposit amount"
                        {...field}
                        className="pl-9"
                        value={field.value ? formatCurrency(field.value) : ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\./g, "");
                          if (/^\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  {!form.formState.errors.amount && (
                    <FormDescription>
                      Enter the amount you wish to deposit to your wallet
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proofOfPayment"
              render={({}) => (
                <FormItem>
                  <FormControl>
                    <ImageUploadEditor
                      multiple={false}
                      defaultAspectRatio="original"
                      aspectRatios={["original", "1:1", "16:9"]}
                      onFileSelect={handleFileSelect}
                      onImageEdit={handleImageEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !uploadedFile}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Deposit...
            </>
          ) : (
            "Submit Deposit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default DepositForm;
