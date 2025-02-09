import { formatDistanceToNow } from "date-fns";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from "@/types/notificationTypes";
import { useRouter } from "next/navigation";

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

  const generateUrl = (type: NotificationType, referenceId: string) => {
    switch (type) {
      case NotificationType.AUCTION:
        return `/auction/${referenceId}`;
      case NotificationType.SYSTEM:
        return `/dashboard/user/${referenceId}`;
      case NotificationType.BID:
        return `/dashboard/auction/${referenceId}`;
      case NotificationType.TRANSACTION:
        return `/dashboard/transactions/${referenceId}`;
      default:
        return "#"; // Default URL if type does not match any case
    }
  };

  const handleClick = () => {
    if (!isMarkingAsRead) {
      onMarkAsRead(notification.notification_id);
      const notificationUrl = notification.reference_id
        ? generateUrl(notification.type, notification.reference_id)
        : "#";
      router.push(notificationUrl);
    }
  };

  return (
    <DropdownMenuItem
      onClick={handleClick}
      className={`ga my-1 flex cursor-pointer flex-col items-start gap-1 p-4 ${
        notification.status === NotificationStatus.READ
          ? "bg-gray-50"
          : "border-l-4 border-sidebar-primary bg-white"
      }`}
    >
      <div className="flex w-full justify-between">
        <span className="font-medium">{notification.type}</span>
        <span className="text-muted-foreground text-xs">
          {formatDistanceToNow(new Date(notification.created_at), {
            addSuffix: true,
          })}
        </span>
      </div>
      <span className="text-muted-foreground text-sm">
        {notification.message}
      </span>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
