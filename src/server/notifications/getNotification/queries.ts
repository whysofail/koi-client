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
  page = 1,
  limit = 10,
}: FetchNotificationsParams) => {
  return useQuery({
    queryKey: ["notifications", { page, limit }], // Simplified query key
    queryFn: () => fetchUserNotifications({ token, page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    gcTime: 1000 * 60 * 10, // 10 minutes cache time
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount
  });
};
