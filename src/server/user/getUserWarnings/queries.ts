import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { GetUserWarningsResponse } from "@/types/usersTypes";

const getUserWarnings = async (id: string, token: string) => {
  const { data } = await fetchWithAuth.get<GetUserWarningsResponse>(
    `/warnings/user/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetUserWarnings = (
  id: string,
  token: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["warnings", id],
    queryFn: () => getUserWarnings(id, token),
    enabled: options?.enabled,
  });
};

export default useGetUserWarnings;
