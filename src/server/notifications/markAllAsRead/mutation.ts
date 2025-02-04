import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { GetNotificationResponse } from "@/types/notificationTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const markAllNotificationsAsRead = async (token: string) => {
  await fetchWithAuth.post(
    "/notifications/read/all",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const useMarkAllNotificationsAsRead = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(token),
    onSuccess: () => {
      queryClient.setQueryData<GetNotificationResponse[]>(
        ["notifications"],
        (oldData) => {
          if (!oldData) return [];
          return oldData.map((notification) => ({
            ...notification,
            read: true,
          }));
        },
      );
    },
  });
};
