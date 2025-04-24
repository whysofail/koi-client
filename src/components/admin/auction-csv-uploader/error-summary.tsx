"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface ErrorIssue {
  row: number;
  issues: string[];
}

interface ErrorsByTypeProps {
  errorsByType: Record<string, ErrorIssue[]>;
  fileTypeState: "csv" | "json" | "excel";
  onJumpToError?: (row: number) => void;
}

export function ErrorSummary({
  errorsByType,
  fileTypeState,
  onJumpToError,
}: ErrorsByTypeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const errorTypes = Object.keys(errorsByType);

  // Get total error count
  const totalErrors = Object.values(errorsByType).reduce(
    (sum, errors) => sum + errors.length,
    0,
  );

  const filterErrors = (errors: ErrorIssue[]) => {
    if (!searchTerm) return errors;

    return errors.filter((error) =>
      error.issues.some((issue) =>
        issue.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          Validation Errors{" "}
          <Badge variant="destructive" className="ml-2">
            {totalErrors}
          </Badge>
        </h3>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search errors..."
            className="h-9 pl-8 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-9 w-9"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={errorTypes[0]} className="w-full">
        <TabsList
          className="grid w-full"
          style={{ gridTemplateColumns: `repeat(${errorTypes.length}, 1fr)` }}
        >
          {errorTypes.map((type) => (
            <TabsTrigger
              key={type}
              value={type}
              className="flex items-center gap-2"
            >
              <span className="truncate">{type}</span>
              <Badge variant="destructive" className="rounded-full text-xs">
                {errorsByType[type].length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {errorTypes.map((type) => (
          <TabsContent key={type} value={type} className="mt-2">
            <Card className="max-h-[300px] overflow-y-auto p-4">
              {filterErrors(errorsByType[type]).length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {filterErrors(errorsByType[type]).map((error, errorIdx) => (
                    <li
                      key={errorIdx}
                      className="flex items-start gap-2 rounded-md p-2 text-red-600 hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <span className="font-medium">
                          Row{" "}
                          {fileTypeState === "csv"
                            ? error.row - 1
                            : error.row - 1}
                          :
                        </span>{" "}
                        {error.issues.join(", ")}
                      </div>
                      {onJumpToError && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => onJumpToError(error.row - 1)}
                        >
                          Jump to row
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-4 text-center text-muted-foreground">
                  {searchTerm
                    ? "No matching errors found"
                    : "No errors of this type"}
                </div>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
