import { useQuery } from "@tanstack/react-query";
import { GetNotificationResponse } from "@/types/notificationTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface FetchNotificationsParams {
  token: string;
  page: number;
  limit: number;
}

const fetchUserNotifications = async ({
  token,
  page = 1,
  limit = 10,
}: FetchNotificationsParams) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await fetchWithAuth.get<GetNotificationResponse>(
    `/notifications/me?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const useUserNotifications = ({
  token,
  ...params
}: FetchNotificationsParams) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => fetchUserNotifications({ token, ...params }),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    placeholderData: (previousData) => previousData, // This replaces keepPreviousData
  });
};
