import { useQuery } from "@tanstack/react-query";
import { GetUserResponse } from "@/types/usersTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const fetchUserData = async (token: string): Promise<GetUserResponse> => {
  const { data } = await fetchWithAuth.get(`/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

const useGetUserData = (token: string) =>
  useQuery({
    queryKey: ["userData"],
    queryFn: () => fetchUserData(token),
  });

export default useGetUserData;
