import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Notification, NotificationType } from "@/types/notificationTypes";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const generateUrl = (type: NotificationType, referenceId: string) => {
    switch (type) {
      case NotificationType.AUCTION:
        return `/auction/${referenceId}`;
      case NotificationType.SYSTEM:
        return `/reports/user/${referenceId}`;
      case NotificationType.BID:
        return `/auction/${referenceId}`;
      case NotificationType.TRANSACTION:
        return `/transactions/${referenceId}`;
      default:
        return "#"; // Default URL if type does not match any case
    }
  };

  const notificationUrl = notification.reference_id
    ? generateUrl(notification.type, notification.reference_id)
    : "#";

  return (
    <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
      <div className="flex w-full justify-between">
        <span className="font-medium">{notification.type}</span>
        <span className="text-muted-foreground text-xs">
          {new Date(notification.created_at).toLocaleString()}
        </span>
      </div>
      <span className="text-muted-foreground text-sm">
        {notification.message}
      </span>
      <a href={notificationUrl} className="text-blue-500 hover:underline">
        View Details
      </a>
    </DropdownMenuItem>
  );
};

export default NotificationItem;
