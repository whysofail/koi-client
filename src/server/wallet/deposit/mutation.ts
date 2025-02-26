import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";
import { createDepositBody } from "@/types/walletTypes";
import { QueryClient, useMutation } from "@tanstack/react-query";

const createDeposit = async (token: string, data: createDepositBody) => {
  await fetchWithAuth.post(`/notifications/deposit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useCreateDeposit = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async ({ data }: { data: createDepositBody }) => {
      try {
        return await createDeposit(token, data);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
    onError: (error) => {
      console.error("Failed to update auction:", error);
    },
  });
};
