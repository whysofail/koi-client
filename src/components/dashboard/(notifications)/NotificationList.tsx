import { Notification } from "@/types/notificationTypes";
import NotificationItem from "./NotificationItem";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  isMarkingAsRead: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  isMarkingAsRead,
}) => {
  return (
    <>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.notification_id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            isMarkingAsRead={isMarkingAsRead}
          />
        ))
      ) : (
        <DropdownMenuItem className="text-muted-foreground text-center">
          No new notifications
        </DropdownMenuItem>
      )}
    </>
  );
};

export default NotificationList;
