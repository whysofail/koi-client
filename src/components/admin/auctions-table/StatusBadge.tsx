import { capitalize, cn } from "@/lib/utils";
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

const borderStyle = "border-2";

const selectedStatusStyles = {
  [AuctionStatus.DRAFT]: `bg-gray-500 text-white ${borderStyle} border-gray-600`,
  [AuctionStatus.PENDING]: `bg-yellow-500 text-white ${borderStyle} border-yellow-600`,
  [AuctionStatus.PUBLISHED]: `bg-green-500 text-white ${borderStyle} border-green-600`,
  [AuctionStatus.COMPLETED]: `bg-blue-500 text-white ${borderStyle} border-blue-600`,
  [AuctionStatus.CANCELLED]: `bg-red-500 text-white ${borderStyle} border-red-600`,
  [AuctionStatus.EXPIRED]: `bg-orange-500 text-white ${borderStyle} border-orange-600`,
  [AuctionStatus.FAILED]: `bg-red-500 text-white ${borderStyle} border-red-600`,
  [AuctionStatus.STARTED]: `bg-purple-500 text-white ${borderStyle} border-purple-600`,
  [AuctionStatus.DELETED]: `bg-gray-700 text-white ${borderStyle} border-gray-800`,
};

interface StatusBadgeProps {
  status: AuctionStatus;
  onClick?: () => void;
  variant?: string;
  className?: string;
  selected?: boolean;
}

const StatusBadge = ({
  status,
  onClick,
  variant,
  className,
  selected,
}: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant ||
          (selected ? selectedStatusStyles[status] : statusStyles[status]),
        className,
      )}
      onClick={onClick}
    >
      {capitalize(status)}
    </span>
  );
};

export default StatusBadge;
