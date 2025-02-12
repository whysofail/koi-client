import { useQuery } from "@tanstack/react-query";
import { GetNotificationResponse } from "@/types/notificationTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const fetchUserNotifications = async (token: string) => {
  const { data } = await fetchWithAuth.get<GetNotificationResponse>(
    "/notifications/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const useUserNotifications = (token: string) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchUserNotifications(token),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
