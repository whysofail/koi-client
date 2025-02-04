import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

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
    mutationFn: (userId: string) => banUser(token, userId),
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (error) => {
      console.error("Failed to ban user:", error);
    },
  });
};

export default useBanUser;
