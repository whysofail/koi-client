"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface VerifiedButtonProps {
  auctionId: string;
  className?: string;
}

const VerifiedButton = ({ auctionId, className }: VerifiedButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="pt-2">
      <Link href={`/dashboard/auctions/verify/${auctionId}`}>
        <Button
          className={cn(
            "w-full border border-green-500 transition-all duration-300",
            isHovered ? "bg-green-500 text-white" : "bg-white text-green-500",
            !isHovered && "animate-pulse",
            className,
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={
            !isHovered
              ? {
                  animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }
              : undefined
          }
        >
          <div className="flex items-center justify-center gap-2">
            {isHovered && <ExternalLink className="h-4 w-4" />}
            <p className="text-bold uppercase">
              {isHovered ? "VERIFICATION DETAILS" : "AUCTION WINNER VERIFIED"}
            </p>
          </div>
        </Button>
      </Link>
    </div>
  );
};

export default VerifiedButton;
