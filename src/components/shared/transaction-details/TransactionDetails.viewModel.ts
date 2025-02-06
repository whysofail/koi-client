// src/viewModels/useTransactionDetailsViewModel.ts

import useGetTransactionByID from "@/server/transaction/getTransactionsById/queries";
import useAcceptRejectDeposit from "@/server/transaction/acceptRejectDeposit/mutation";
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
        onError: () => {
          toast.error("Failed to approve transaction");
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
        onError: () => {
          toast.error("Failed to reject transaction");
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
