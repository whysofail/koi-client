"use client";

import { FC } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { User } from "next-auth";
import { Notification, NotificationStatus } from "@/types/notificationTypes";
import NotificationList from "./(notifications)/NotificationList";
import { useSocket } from "@/hooks/use-socket";
import { useUserNotifications } from "@/server/notifications/getNotification/queries";
import { useMarkAllNotificationsAsRead } from "@/server/notifications/markAllAsRead/mutation";
import { useMarkNotificationAsRead } from "@/server/notifications/markAsRead/mutation";
import { useNotificationSocket } from "@/hooks/useNotification";
interface NotificationsDropdownProps {
  user: User;
}

const NotificationsDropdown: FC<NotificationsDropdownProps> = ({ user }) => {
  const accessToken = user.accessToken;

  // Socket setup
  const { authSocket } = useSocket(accessToken);
  useNotificationSocket({ authSocket });

  // Notifications query and mutations
  const {
    data: notificationsData,
    isLoading,
    isError,
  } = useUserNotifications(accessToken);

  const markAllAsRead = useMarkAllNotificationsAsRead(accessToken);
  const markAsRead = useMarkNotificationAsRead(accessToken);

  // Ensure notificationsData is properly structured
  const notifications: Notification[] = notificationsData?.data ?? [];

  // Calculate unread count safely
  const unreadCount = notifications.filter(
    (n) => n.status === NotificationStatus.UNREAD,
  ).length;

  // Limit displayed notifications to 5
  const displayedNotifications = notifications.slice(0, 5);

  // Handler for marking all notifications as read
  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-w-[90vw]">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsRead.isPending}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem className="text-muted-foreground text-center">
            Loading...
          </DropdownMenuItem>
        ) : isError ? (
          <DropdownMenuItem className="text-muted-foreground text-center">
            Error fetching notifications
          </DropdownMenuItem>
        ) : displayedNotifications.length === 0 ? (
          <DropdownMenuItem className="text-muted-foreground text-center">
            No notifications
          </DropdownMenuItem>
        ) : (
          <NotificationList
            notifications={displayedNotifications}
            onMarkAsRead={(notificationId) => markAsRead.mutate(notificationId)}
            isMarkingAsRead={markAsRead.isPending}
          />
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full cursor-pointer text-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
