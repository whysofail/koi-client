import { cn } from "@/lib/utils";
import { TransactionType } from "@/types/transactionTypes";
import { capitalize } from "@/lib/utils";
const statusStyles = {
  [TransactionType.DEPOSIT]: "bg-orange-500/20 text-orange-500",
  [TransactionType.PARTICIPATE]: "bg-purple-500/20 text-purple-500",
  [TransactionType.TRANSFER]: "bg-yellow-500/20 text-yellow-500",
  [TransactionType.WITHDRAWAL]: "bg-blue-500/20 text-blue-500",
};

interface TypeBadgeProps {
  type: TransactionType;
}

const TypeBadge = ({ type }: TypeBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[type],
      )}
    >
      {capitalize(type)}
    </span>
  );
};

export default TypeBadge;
