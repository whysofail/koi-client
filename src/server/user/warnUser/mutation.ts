import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { WarnUserBody } from "@/types/usersTypes";

const warnUser = async (token: string, data: WarnUserBody) => {
  const { data: response } = await fetchWithAuth.post(`warnings/warn`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

const useWarnUser = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: (data: WarnUserBody) => warnUser(token, data),
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["warnedUsers"] });
    },
    onError: (error) => {
      console.error("Failed to warn user:", error);
    },
  });
};

export default useWarnUser;
