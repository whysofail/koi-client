import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PaginatedUsersResponse } from "@/types/usersTypes";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

interface FetchAllUsersParams {
  token: string;
  page?: number;
  limit?: number;
  role?: UserRole;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
}

const dateNow = new Date();
const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

const fetchAllUsers = async ({
  token,
  page = 1,
  limit = 10,
  role = UserRole.USER,
  registrationDateFrom = dateNow,
  registrationDateTo = nextWeek,
}: FetchAllUsersParams): Promise<PaginatedUsersResponse> => {
  const { data } = await axios.get(
    `${process.env.BACKEND_URL}/api/users?page=${page}&limit=${limit}&role=${role}&registration_date_from=${registrationDateFrom}&registration_date_to=${registrationDateTo}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return data;
};

const useGetAllUsers = ({ token, ...params }: FetchAllUsersParams) =>
  useQuery({
    queryKey: ["allUsers", params, token],
    queryFn: () => fetchAllUsers({ token, ...params }),
  });

export default useGetAllUsers;
