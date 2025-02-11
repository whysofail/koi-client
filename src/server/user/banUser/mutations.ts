import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";

const banUser = async (token: string, userId: string) => {
  const { data: response } = await fetchWithAuth.post(
    `/warnings/user/ban/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

const useBanUser = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        return await banUser(token, userId);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async (_, __, userId) => {
      await queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      await queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error) => {
      console.error("Failed to ban user:", error);
    },
  });
};

export default useBanUser;
