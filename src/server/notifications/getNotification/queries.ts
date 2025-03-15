import { useQuery } from "@tanstack/react-query";
import { GetNotificationResponse } from "@/types/notificationTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AxiosResponse } from "axios";

interface FetchNotificationsParams {
  token: string;
  page?: number;
  limit?: number;
  options?: {
    refetchOnMount?: boolean | "always";
    refetchOnWindowFocus?: boolean | "always";
    staleTime?: number;
    gcTime?: number;
    enabled?: boolean;
  };
}

export const fetchUserNotifications = async ({
  token,
  page = 1,
  limit = 10,
}: {
  token: string;
  page?: number;
  limit?: number;
}): Promise<AxiosResponse<GetNotificationResponse>> => {
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
  options = {},
}: FetchNotificationsParams) => {
  const {
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    staleTime = 1000 * 60 * 5, // 5 minutes default
    gcTime = 1000 * 60 * 10, // 10 minutes default
    enabled = !!token,
  } = options;

  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: () => fetchUserNotifications({ token, page, limit }),
    staleTime,
    gcTime,
    placeholderData: (previousData) => previousData,
    refetchOnMount,
    refetchOnWindowFocus,
    refetchOnReconnect: true,
    enabled,
  });
};
