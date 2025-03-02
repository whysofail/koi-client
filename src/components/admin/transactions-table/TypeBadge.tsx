import { cn } from "@/lib/utils";
import { TransactionType } from "@/types/transactionTypes";
import { capitalize } from "@/lib/utils";

const statusStyles = {
  [TransactionType.DEPOSIT]: "bg-orange-500/20 text-orange-500",
  [TransactionType.PARTICIPATE]: "bg-purple-500/20 text-purple-500",
  [TransactionType.TRANSFER]: "bg-yellow-500/20 text-yellow-500",
  [TransactionType.WITHDRAWAL]: "bg-blue-500/20 text-blue-500",
  [TransactionType.REFUND]: "bg-green-500/20 text-green-500",
};

const selectedBorder = "border-2";

const selectedStatusStyles = {
  [TransactionType.DEPOSIT]: `bg-orange-500 text-white ${selectedBorder} border-orange-600`,
  [TransactionType.PARTICIPATE]: `bg-purple-500 text-white ${selectedBorder} border-purple-600`,
  [TransactionType.TRANSFER]: `bg-yellow-500 text-white ${selectedBorder} border-yellow-600`,
  [TransactionType.WITHDRAWAL]: `bg-blue-500 text-white ${selectedBorder} border-blue-600`,
  [TransactionType.REFUND]: `bg-green-500 text-white ${selectedBorder} border-green-600`,
};

interface TypeBadgeProps {
  type: TransactionType;
  onClick?: () => void;
  variant?: string;
  className?: string;
  selected?: boolean;
}

const TypeBadge = ({
  type,
  className,
  variant,
  onClick,
  selected,
}: TypeBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant || (selected ? selectedStatusStyles[type] : statusStyles[type]),
        className,
      )}
      onClick={onClick}
    >
      {capitalize(type)}
    </span>
  );
};

export default TypeBadge;
