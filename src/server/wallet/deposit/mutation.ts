import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";
import { createDepositBody } from "@/types/walletTypes";
import { QueryClient, useMutation } from "@tanstack/react-query";

const createDeposit = async (token: string, data: createDepositBody) => {
  await fetchWithAuth.post(`/wallets/deposit`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
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
      // Invalidate with the correct query key structure
      return await queryClient.invalidateQueries({
        queryKey: [
          "transactions",
          {
            token,
            isAdmin: false,
            page: 1,
            limit: 10,
            // Match default params from your transaction query
            createdAtTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            orderBy: "CREATED_AT",
            order: "DESC",
          },
        ],
      });
    },
  });
};
