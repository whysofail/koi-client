import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";

const acceptRejectDeposit = async (
  token: string,
  transactionId: string,
  status: "APPROVED" | "REJECTED",
) => {
  const { data: response } = await fetchWithAuth.put(
    `/transactions/${transactionId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

const useAcceptRejectDeposit = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({
      transactionId,
      status,
    }: {
      transactionId: string;
      status: "APPROVED" | "REJECTED";
    }) => {
      try {
        return await acceptRejectDeposit(token, transactionId, status);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async (_, __, { transactionId }) => {
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({
        queryKey: ["transaction", transactionId],
      });
    },
    onError: (error) => {
      console.error("Failed to update transaction status:", error);
    },
  });
};

export default useAcceptRejectDeposit;
