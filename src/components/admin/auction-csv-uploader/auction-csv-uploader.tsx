"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuctionCsvUploader } from "./auctionCsvUploader.viewModel";
import {
  AlertCircle,
  Check,
  Download,
  ExternalLink,
  FileUp,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { ErrorDialog } from "./error-dialog";
import { Badge } from "@/components/ui/badge";

import downloadTemplate from "@/lib/generateXLSX";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";

export default function AuctionCsvUploaderDialog({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [, setFileType] = useState<"csv" | "xlsx">("csv");
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const {
    data,
    errors,
    isUploading,
    isSuccess,
    handleFileChange,
    handleUpload,
    reset,
    fileType: fileTypeState,
  } = useAuctionCsvUploader(token);

  const handleClose = () => {
    setOpen(false);
    reset(); // Clear states when closing
  };

  // Count unique rows with errors
  const uniqueRowsWithErrors = new Set(errors.map((error) => error.row)).size;
  const totalIssues = errors.reduce(
    (count, error) => count + error.issues.length,
    0,
  );

  // Function to scroll to a specific row in the table
  const jumpToRow = (rowIndex: number) => {
    // Close the error dialog first
    setErrorDialogOpen(false);

    // Set the highlighted row
    setHighlightedRow(rowIndex);

    // Use a timeout to ensure the dialog is closed and the main dialog is visible
    setTimeout(() => {
      if (tableRef.current) {
        const tableRows = tableRef.current.querySelectorAll("tbody tr");

        if (tableRows[rowIndex]) {
          // Scroll the row into view
          tableRows[rowIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }, 100); // Short delay to ensure dialog state has updated
  };

  // Clear highlight after a delay
  useEffect(() => {
    if (highlightedRow !== null) {
      const timer = setTimeout(() => {
        setHighlightedRow(null);
      }, 3000); // Keep highlight for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [highlightedRow]);

  // Format date values
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return format(date, "MMM d, yyyy h:mm a");
    } catch {
      return dateStr;
    }
  };

  const hasResetRef = useRef(false);

  useEffect(() => {
    if (isSuccess && !isUploading && !hasResetRef.current) {
      hasResetRef.current = true; // Prevent multiple resets
      setOpen(false);
      reset();
    }
  }, [isSuccess, isUploading, reset]);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <FileUp className="h-4 w-4" />
        Bulk Upload Auction
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose(); // Only close/reset if user closes
          } else {
            setOpen(true); // Open manually if needed
          }
        }}
      >
        <DialogContent className="my-4 max-h-screen max-w-7xl overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-xl">Bulk Upload Auction</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="csv-file" className="text-sm font-medium">
                Select CSV or XLSX File
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv, .xlsx"
                    className="cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileChange(file);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download Template
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setFileType("csv");
                            downloadTemplate("csv");
                          }}
                        >
                          CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setFileType("xlsx");
                            downloadTemplate("xlsx");
                          }}
                        >
                          XLSX
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>

            {isSuccess && !isUploading && (
              <Alert className="border-green-200 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your auctions have been successfully uploaded.
                </AlertDescription>
              </Alert>
            )}

            {errors.length > 0 && (
              <Alert variant="destructive" className="flex items-center gap-4">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="flex items-center gap-2">
                  <AlertTitle className="m-0 text-base leading-none">
                    Validation Failed:
                  </AlertTitle>
                  <AlertDescription className="flex items-center gap-2 leading-none">
                    <span>
                      Found {totalIssues} issues in {uniqueRowsWithErrors} rows.
                      Please fix them and try again.
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 bg-white hover:bg-white"
                      onClick={() => setErrorDialogOpen(true)}
                    >
                      View Errors
                      <Badge variant="destructive" className="ml-2">
                        {uniqueRowsWithErrors}
                      </Badge>
                    </Button>
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {data.length > 0 && (
              <div className="border">
                <div className="max-h-[24rem] overflow-auto" ref={tableRef}>
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-medium">No</th>
                        <th className="px-4 py-2 text-left font-medium">
                          Koi ID
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Title
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Description
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Buy Now Price
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Participation Fee
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Bid Starting Price
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Bid Increment
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          Start Date
                        </th>
                        <th className="px-4 py-2 text-left font-medium">
                          End Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => {
                        const hasError = errors.some(
                          (e) => e.row === index + 2,
                        );
                        const isHighlighted = highlightedRow === index;

                        return (
                          <tr
                            key={index}
                            className={cn(
                              "border-t transition-colors duration-300",
                              hasError ? "bg-red-50" : "",
                              isHighlighted ? "bg-amber-200 shadow-md" : "", // More prominent highlighting
                            )}
                            id={`table-row-${index}`}
                          >
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">
                              <Link
                                href={`${process.env.NEXT_PUBLIC_LARAVEL_URL}/CMS/koi/detail/${row.item}`}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                <span className="group flex text-blue-500 hover:underline">
                                  <ExternalLink className="group mr-1 h-4 w-4 hover:underline" />
                                  {row.item}
                                </span>
                              </Link>
                            </td>
                            <td className="max-w-[200px] truncate px-4 py-2">
                              {row.title}
                            </td>
                            <td className="max-w-[200px] truncate px-4 py-2">
                              {row.description}
                            </td>
                            <td className="px-4 py-2">
                              {formatCurrency(row.buynow_price)}
                            </td>
                            <td className="px-4 py-2">
                              {formatCurrency(row.participation_fee)}
                            </td>
                            <td className="px-4 py-2">
                              {formatCurrency(row.bid_starting_price)}
                            </td>
                            <td className="px-4 py-2">
                              {formatCurrency(row.bid_increment)}
                            </td>
                            <td className="px-4 py-2">
                              {formatDate(row.start_datetime)}
                            </td>
                            <td className="px-4 py-2">
                              {formatDate(row.end_datetime)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-sm text-gray-500">
                  Showing {data.length} auctions
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={reset}
                className="flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                Reset
              </Button>
            </div>

            <div className="space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || data.length === 0 || errors.length > 0}
                className={isUploading ? "opacity-80" : ""}
              >
                {isUploading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload Auctions"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Separate Error Dialog */}
      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        errors={errors}
        fileType={fileTypeState as "csv" | "xlsx" | "null"}
        onJumpToRow={jumpToRow}
      />
    </>
  );
}
