"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "./error-display";
import type { ValidationError } from "@/types/auctionTypes";
import { X } from "lucide-react";

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errors: ValidationError[];
  fileType: "csv" | "xlsx" | "null";
  onJumpToRow?: (row: number) => void;
}

export function ErrorDialog({
  open,
  onOpenChange,
  errors,
  fileType,
  onJumpToRow,
}: ErrorDialogProps) {
  // Count unique rows with errors
  const uniqueRowsWithErrors = new Set(errors.map((error) => error.row)).size;
  const totalIssues = errors.reduce(
    (count, error) => count + error.issues.length,
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Validation Errors ({totalIssues} issues in {uniqueRowsWithErrors}{" "}
            rows)
          </DialogTitle>
        </DialogHeader>

        <ErrorDisplay
          errors={errors}
          fileType={fileType}
          onJumpToRow={onJumpToRow}
        />

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
