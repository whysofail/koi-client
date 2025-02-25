import { useQuery } from "@tanstack/react-query";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { GetDetailedUserResponse } from "@/types/usersTypes";

const getLoggedInUser = async (token: string) => {
  const { data } = await fetchWithAuth.get<GetDetailedUserResponse>(
    `/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetLoggedInUser = (token: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getLoggedInUser(token),
    enabled: options?.enabled,
  });
};

export default useGetLoggedInUser;
