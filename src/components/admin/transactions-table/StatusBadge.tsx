import { cn } from "@/lib/utils";
import { TransactionStatus } from "@/types/transactionTypes";
import { capitalize } from "@/lib/utils";

const statusStyles = {
  [TransactionStatus.APPROVED]: "bg-orange-500/20 text-orange-500",
  [TransactionStatus.REJECTED]: "bg-red-500/20 text-red-500",
  [TransactionStatus.PENDING]: "bg-yellow-500/20 text-yellow-500",
  [TransactionStatus.COMPLETED]: "bg-green-500/20 text-green-500",
  [TransactionStatus.FAILED]: "bg-red-500/20 text-red-500",
};

const selectedBorder = "border-2";

const selectedStatusStyles = {
  [TransactionStatus.APPROVED]: `bg-orange-500 text-white ${selectedBorder} border-orange-600`,
  [TransactionStatus.REJECTED]: `bg-red-500 text-white ${selectedBorder} border-purple-600`,
  [TransactionStatus.PENDING]: `bg-yellow-500 text-white ${selectedBorder} border-yellow-600`,
  [TransactionStatus.COMPLETED]: `bg-green-500 text-white ${selectedBorder} border-green-600`,
  [TransactionStatus.FAILED]: `bg-red-500 text-white ${selectedBorder} border-red-600`,
};

interface StatusBadgeProps {
  status: TransactionStatus;
  onClick?: () => void;
  variant?: string;
  className?: string;
  selected?: boolean;
}

const StatusBadge = ({
  status,
  className,
  variant,
  onClick,
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
