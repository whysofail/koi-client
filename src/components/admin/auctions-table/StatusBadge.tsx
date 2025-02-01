import { cn } from "@/lib/utils";
import { AuctionStatus } from "@/types/auctionTypes";

const statusStyles = {
  [AuctionStatus.DRAFT]: "bg-gray-500/20 text-gray-500",
  [AuctionStatus.PENDING]: "bg-yellow-500/20 text-yellow-500",
  [AuctionStatus.PUBLISHED]: "bg-green-500/20 text-green-500",
  [AuctionStatus.COMPLETED]: "bg-blue-500/20 text-blue-500",
  [AuctionStatus.CANCELLED]: "bg-red-500/20 text-red-500",
  [AuctionStatus.EXPIRED]: "bg-orange-500/20 text-orange-500",
  [AuctionStatus.FAILED]: "bg-red-500/20 text-red-500",
  [AuctionStatus.STARTED]: "bg-purple-500/20 text-purple-500",
  [AuctionStatus.DELETED]: "bg-gray-700/20 text-gray-700",
};

interface StatusBadgeProps {
  status: AuctionStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
