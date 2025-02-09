import { useQueryClient } from "@tanstack/react-query";
import { useMarkNotificationAsRead } from "@/server/notifications/markAsRead/mutation";
import { useMarkAllNotificationsAsRead } from "@/server/notifications/markAllAsRead/mutation";
import { useUserNotifications } from "@/server/notifications/getNotification/queries";

const useNotificationViewModel = (token: string) => {
  const queryClient = useQueryClient();

  // Fetch user notifications
  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
  } = useUserNotifications(token);

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

  // Optional: Refetch notifications
  const refetchNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    notifications: notifications?.data || [],
    isNotificationsLoading,
    notificationsError,
    handleMarkAsRead,
    handleMarkAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead,
    refetchNotifications,
  };
};

export default useNotificationViewModel;
