import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMarkNotificationAsRead } from "@/server/notifications/markAsRead/mutation";
import { useMarkAllNotificationsAsRead } from "@/server/notifications/markAllAsRead/mutation";
import { useUserNotifications } from "@/server/notifications/getNotification/queries";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { Socket } from "socket.io-client";
import { useSearchParams, useRouter } from "next/navigation";

interface UseNotificationViewModelProps {
  token: string;
  authSocket: Socket | null;
}

const useNotificationViewModel = ({
  token,
  authSocket,
}: UseNotificationViewModelProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params.toString();
    },
    [searchParams],
  );

  const queryClient = useQueryClient();
  useNotificationSocket({ authSocket });

  // Fetch user notifications
  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
  } = useUserNotifications({
    token,
    page: pageIndex,
    limit: pageSize,
  });

  // Mutation to mark a single notification as read
  const { mutate: markAsRead, isPending: isMarkingAsRead } =
    useMarkNotificationAsRead(token);

  // Mutation to mark all notifications as read
  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } =
    useMarkAllNotificationsAsRead(token);

  // Handler for marking a single notification as read
  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
  };

  // Handler for marking all notifications as read
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const setPageIndex = useCallback(
    (page: number) => {
      router.push(`?${createQueryString({ page: page.toString() })}`);
    },
    [createQueryString, router],
  );

  const setPageSize = useCallback(
    (limit: number) => {
      router.push(
        `?${createQueryString({ limit: limit.toString(), page: "1" })}`,
      );
    },
    [createQueryString, router],
  );

  // Optional: Refetch notifications
  const refetchNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    notifications: notifications?.data.data || [],
    isNotificationsLoading,
    notificationsError,
    handleMarkAsRead,
    handleMarkAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead,
    refetchNotifications,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    total: notifications?.data.count || 0,
  };
};

export default useNotificationViewModel;
