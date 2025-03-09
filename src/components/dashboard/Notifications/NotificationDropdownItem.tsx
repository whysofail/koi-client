import { useCallback, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from "@/types/notificationTypes";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (notificationId: string) => void;
  isMarkingAsRead: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}) => {
  const router = useRouter();

  // Memoize the URL generation to avoid recalculating on every render
  const notificationUrl = useMemo(() => {
    if (!notification.reference_id) return "#";

    switch (notification.type) {
      case NotificationType.AUCTION:
        return `/auction/${notification.reference_id}`;
      case NotificationType.SYSTEM:
        return `/dashboard/user/${notification.reference_id}`;
      case NotificationType.BID:
        return `/dashboard/auction/${notification.reference_id}`;
      case NotificationType.TRANSACTION:
        return `/dashboard/transactions/${notification.reference_id}`;
      default:
        return "#"; // Default URL if type does not match any case
    }
  }, [notification.type, notification.reference_id]);

  // Handle click event
  const handleClick = useCallback(() => {
    if (!isMarkingAsRead) {
      onMarkAsRead(notification.notification_id);
      router.push(notificationUrl);
    }
  }, [
    isMarkingAsRead,
    onMarkAsRead,
    notification.notification_id,
    notificationUrl,
    router,
  ]);

  // Determine the background and border styles based on the notification status
  const itemStyles = useMemo(() => {
    const baseStyles =
      "my-1 flex cursor-pointer flex-col items-start gap-1 p-4";
    const statusStyles =
      notification.status === NotificationStatus.READ
        ? "bg-gray-100 dark:bg-slate-800"
        : "border-l-4 border-sidebar-primary bg-white dark:bg-inherit";

    return `${baseStyles} ${statusStyles}`;
  }, [notification.status]);

  return (
    <DropdownMenuItem
      onClick={handleClick}
      className={itemStyles}
      aria-disabled={isMarkingAsRead}
      role="button"
      tabIndex={0}
    >
      <div className="flex w-full justify-between">
        <span className="font-medium">{notification.type}</span>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
          })}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">
        {notification.message}
      </span>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
