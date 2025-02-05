import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const unbanUser = async (token: string, userId: string) => {
  const { data: response } = await fetchWithAuth.post(
    `/warnings/user/unban/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

const useUnbanUser = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (userId: string) => unbanUser(token, userId),
    onSettled: async (_, __, userId) => {
      await queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      await queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
    onError: (error) => {
      console.error("Failed to unban user:", error);
    },
  });
};

export default useUnbanUser;
