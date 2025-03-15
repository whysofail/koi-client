import { useQuery } from "@tanstack/react-query";
import { GetNotificationResponse } from "@/types/notificationTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AxiosResponse } from "axios";

interface FetchNotificationsParams {
  token: string;
  page?: number;
  limit?: number;
}

export const fetchUserNotifications = async ({
  token,
  page = 1,
  limit = 10,
}: FetchNotificationsParams): Promise<
  AxiosResponse<GetNotificationResponse>
> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  return fetchWithAuth.get<GetNotificationResponse>(
    `/notifications/me?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const useUserNotifications = ({
  token,
  page = 1,
  limit = 10,
}: FetchNotificationsParams) => {
  console.log("token provided:", token);
  console.log("!!token", !!token);
  return useQuery<AxiosResponse<GetNotificationResponse>, Error>({
    queryKey: ["notifications", { token, page, limit }],
    queryFn: () => fetchUserNotifications({ token, page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    gcTime: 1000 * 60 * 10, // 10 minutes cache time

    placeholderData: (previousData) => {
      // Return the previous data to avoid loading states during pagination
      return previousData;
    },

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!token,
  });
};
