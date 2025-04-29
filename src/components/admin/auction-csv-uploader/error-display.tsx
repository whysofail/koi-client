"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, X, AlertCircle, ChevronRight } from "lucide-react";
import type { ValidationError } from "@/types/auctionTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ErrorDisplayProps {
  errors: ValidationError[];
  fileType: "csv" | "xlsx" | "null";
  onJumpToRow?: (row: number) => void;
}

export function ErrorDisplay({
  errors,
  fileType,
  onJumpToRow,
}: ErrorDisplayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const pageSize = 10;

  // Group errors by row
  const errorsByRow = errors.reduce((acc: Record<number, string[]>, error) => {
    if (!acc[error.row]) {
      acc[error.row] = [];
    }
    error.issues.forEach((issue) => {
      if (!acc[error.row].includes(issue)) {
        acc[error.row].push(issue);
      }
    });
    return acc;
  }, {});

  // Convert grouped errors to array for display
  const rowErrors = Object.entries(errorsByRow).map(([row, issues]) => ({
    row: Number.parseInt(row),
    issues,
  }));

  // Filter rows based on search term
  const filteredRows = rowErrors.filter(
    (rowError) =>
      rowError.issues.some((issue) =>
        issue.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || rowError.row.toString().includes(searchTerm),
  );

  // Sort rows by row number
  const sortedRows = [...filteredRows].sort((a, b) => {
    return sortOrder === "asc" ? a.row - b.row : b.row - a.row;
  });

  // Paginate rows
  const totalPages = Math.ceil(sortedRows.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedRows = sortedRows.slice(start, start + pageSize);

  // Reset to page 1 if current page is out of bounds
  if (page > totalPages && totalPages > 0 && page !== 1) {
    setPage(1);
  }

  // Calculate the actual row index for jumping (accounting for header row)
  // const getActualRowIndex = (csvRow: number) => {
  //   // For CSV files, the first row is usually a header, so we subtract 2
  //   // (1 for the header row, and 1 because rows are 1-indexed in the error object but 0-indexed in the array)
  //   return fileType === "csv" ? csvRow - 2 : csvRow - 1;
  // };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Validation Errors</h3>
          <Badge variant="destructive" className="rounded-full text-xs">
            {Object.keys(errorsByRow).length}
          </Badge>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search errors..."
              className="h-9 pl-8 text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to first page on search
              }}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-9 w-9"
                onClick={() => {
                  setSearchTerm("");
                  setPage(1); // Reset to first page when clearing search
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>

          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Sort by row" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Row (Ascending)</SelectItem>
              <SelectItem value="desc">Row (Descending)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-3">
        <ScrollArea className="h-[500px] pr-4">
          {paginatedRows.length > 0 ? (
            <ul className="space-y-4">
              {paginatedRows.map((rowError) => {
                // const actualRowIndex = getActualRowIndex(rowError.row);

                return (
                  <li
                    key={rowError.row}
                    className="overflow-hidden rounded-md border"
                  >
                    <div className="flex items-center justify-between bg-muted px-3 py-2">
                      <div className="flex items-center font-medium">
                        <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs text-red-600">
                          {rowError.issues.length}
                        </span>
                        Row{" "}
                        {fileType === "csv"
                          ? rowError.row - 1
                          : rowError.row - 1}
                      </div>
                      {onJumpToRow && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                          onClick={() => onJumpToRow(rowError.row - 2)}
                        >
                          <span>Jump to row</span>
                          <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="bg-white p-3">
                      <ul className="space-y-1.5">
                        {rowError.issues.map((issue, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-red-600"
                          >
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {searchTerm ? "No matching errors found" : "No errors found"}
            </div>
          )}
        </ScrollArea>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, sortedRows.length)} of{" "}
              {sortedRows.length} rows with errors
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              {totalPages <= 5 ? (
                // Show all page numbers if 5 or fewer
                Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    className="h-7 w-7 px-0"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))
              ) : (
                // Show limited page numbers with ellipsis for many pages
                <>
                  <Button
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className="h-7 w-7 px-0"
                    onClick={() => setPage(1)}
                  >
                    1
                  </Button>

                  {page > 3 && <span className="px-1">...</span>}

                  {page > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 px-0"
                      onClick={() => setPage(page - 1)}
                    >
                      {page - 1}
                    </Button>
                  )}

                  {page !== 1 && page !== totalPages && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7 w-7 px-0"
                    >
                      {page}
                    </Button>
                  )}

                  {page < totalPages - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 px-0"
                      onClick={() => setPage(page + 1)}
                    >
                      {page + 1}
                    </Button>
                  )}

                  {page < totalPages - 2 && <span className="px-1">...</span>}

                  <Button
                    variant={page === totalPages ? "default" : "outline"}
                    size="sm"
                    className="h-7 w-7 px-0"
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
