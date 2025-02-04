import { Notification } from "@/types/notificationTypes";
import NotificationItem from "./NotificationItem";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
}) => {
  return (
    <>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.notification_id}
            notification={notification}
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
