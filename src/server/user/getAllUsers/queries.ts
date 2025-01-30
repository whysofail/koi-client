import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  PaginatedUsersResponse,
  FetchAllUsersParams,
  UserRole,
  UserOrderBy,
} from "@/types/usersTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const dateNow = new Date();
const nextWeek = new Date(dateNow.getTime() + 7 * 24 * 60 * 60 * 1000);

const fetchAllUsers = async ({
  token,
  page = 1,
  limit = 10,
  role = UserRole.USER,
  registrationDateFrom,
  registrationDateTo = nextWeek,
  isBanned = false,
  orderBy = UserOrderBy.REGISTRATION_DATE,
  order = "DESC",
}: FetchAllUsersParams): Promise<PaginatedUsersResponse> => {
  const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    role,
    registrationDateTo: formatDate(registrationDateTo),
    orderBy,
    order,
  });

  if (registrationDateFrom) {
    params.append("registrationDateFrom", formatDate(registrationDateFrom));
  }

  if (typeof isBanned === "boolean") {
    params.append("isBanned", isBanned.toString());
  }

  const { data } = await fetchWithAuth.get(`/users?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

const useGetAllUsers = ({ token, ...params }: FetchAllUsersParams) =>
  useQuery({
    queryKey: ["allUsers", params, token],
    queryFn: () => fetchAllUsers({ token, ...params }),
  });

export default useGetAllUsers;
