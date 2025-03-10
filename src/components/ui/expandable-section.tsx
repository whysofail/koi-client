"use client";

import type React from "react";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableSectionProps {
  title?: string;
  preview?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function ExpandableSection({
  title = "Details",
  preview,
  children,
  className,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("rounded-lg border", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4 text-left"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base font-medium">{title}</h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      {!isExpanded && preview && (
        <div
          className="px-4 pb-4 opacity-60 transition-opacity duration-200"
          onClick={() => setIsExpanded(true)}
        >
          {preview}
        </div>
      )}

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="p-4 pt-0">{children}</div>
      </div>
    </div>
  );
}
