import { useQuery } from "@tanstack/react-query";
import { GetUserResponse } from "@/types/usersTypes";
import axios from "axios";

const fetchUserData = async (token: string): Promise<GetUserResponse> => {
  const { data } = await axios.get(`${process.env.BACKEND_URL}/api/users`, {
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
