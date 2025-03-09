import { memo } from "react";
import { Notification } from "@/types/notificationTypes";
import NotificationItem from "./NotificationDropdownItem";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  isMarkingAsRead: boolean;
}

// Empty state component for better reusability
const EmptyNotifications = () => (
  <DropdownMenuItem className="text-muted-foreground text-center">
    No new notifications
  </DropdownMenuItem>
);

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
        <EmptyNotifications />
      )}
    </>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(NotificationList);
