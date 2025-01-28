import {
  GetNotificationResponse,
  NotificationRole,
} from "@/types/notificationTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { FetchAllNotificationParams } from "@/types/notificationTypes";
import { useQuery } from "@tanstack/react-query";

const fetchNotifications = async (
  token: string,
  params?: FetchAllNotificationParams, // Optional query parameters
): Promise<GetNotificationResponse[]> => {
  const { data } = await fetchWithAuth.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params, // Pass query parameters directly
  });
  return data;
};

const fetchUserNotifications = async (
  token: string,
): Promise<GetNotificationResponse> => {
  const { data } = await fetchWithAuth.get("/notifications/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const useGetAdminNotifications = (
  params: FetchAllNotificationParams,
  token: string,
) =>
  useQuery({
    queryKey: ["adminNotifications", token],
    queryFn: () => {
      return fetchNotifications(token, {
        ...params,
        role: NotificationRole.ADMIN,
      });
    },
  });

export const useGetUserNotifications = (token: string) =>
  useQuery({
    queryKey: ["userNotifications"],
    queryFn: () => {
      return fetchUserNotifications(token);
    },
  });
