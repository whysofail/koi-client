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

interface StatusBadgeProps {
  status: TransactionStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {capitalize(status)}
    </span>
  );
};

export default StatusBadge;
