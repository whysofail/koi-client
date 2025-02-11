import useGetTransactionByID from "@/server/transaction/getTransactionsById/queries";
import useAcceptRejectDeposit from "@/server/transaction/acceptRejectDeposit/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useTransactionDetailsViewModel = (
  transactionId: string,
  token: string,
  onSuccess?: () => void,
) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useGetTransactionByID(
    transactionId,
    token,
  );
  const acceptRejectMutation = useAcceptRejectDeposit(token, queryClient);

  const handleAcceptTransaction = () => {
    acceptRejectMutation.mutate(
      { transactionId, status: "APPROVED" },
      {
        onSuccess: () => {
          toast.success("Transaction approved successfully");
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message);
          console.error("Failed to approve transaction:", error);
        },
      },
    );
  };

  const handleRejectTransaction = () => {
    acceptRejectMutation.mutate(
      { transactionId, status: "REJECTED" },
      {
        onSuccess: () => {
          toast.success("Transaction rejected successfully");
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.message);
          console.error("Failed to reject transaction:", error);
        },
      },
    );
  };

  return {
    transaction: data?.data,
    isLoading,
    error,
    handleAcceptTransaction,
    handleRejectTransaction,
    isUpdatingTransaction: acceptRejectMutation.isPending,
  };
};
