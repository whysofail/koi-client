import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { WarnUserBody } from "@/types/usersTypes";
import { getErrorMessage } from "@/lib/handleApiError";

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
    mutationFn: async (data: WarnUserBody) => {
      try {
        return await warnUser(token, data);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Failed to warn user:", error);
    },
  });
};

export default useWarnUser;
