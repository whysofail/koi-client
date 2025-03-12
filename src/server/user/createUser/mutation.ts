import { useMutation, QueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getErrorMessage } from "@/lib/handleApiError";
import { CreateAdminUserBody } from "@/types/usersTypes";

const createAdminUser = async (token: string, data: CreateAdminUserBody) => {
  const { data: response } = await fetchWithAuth.post(
    `/auth/register-admin`,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

const useCreateAdminUser = (token: string, queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (data: CreateAdminUserBody) => {
      try {
        return await createAdminUser(token, data);
      } catch (error) {
        throw new Error(getErrorMessage(error));
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (error) => {
      console.error("Failed to create admin user:", error);
    },
  });
};

export default useCreateAdminUser;
