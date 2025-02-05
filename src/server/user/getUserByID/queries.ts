import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { GetDetailedUserResponse } from "@/types/usersTypes";

const getUserByID = async (id: string, token: string) => {
  const { data } = await fetchWithAuth.get<GetDetailedUserResponse>(
    `/users/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetUserByID = (
  id: string,
  token: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserByID(id, token),
    enabled: options?.enabled,
  });
};

export default useGetUserByID;
