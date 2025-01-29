"use client";

import { FC, useEffect, useState, useMemo } from "react";
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
import { useSocketWithAuth } from "@/hooks/use-socket";
import {
  Notification,
  NotificationStatus,
  GetNotificationResponse,
} from "@/types/notificationTypes";
import { useGetUserNotifications } from "@/server/notifications/getAdminNotification/queries";

interface NotificationsDropdownProps {
  user: User;
}

const NotificationsDropdown: FC<NotificationsDropdownProps> = ({ user }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isAdmin = user.role === "admin";

  const unreadCount = useMemo(
    () =>
      notifications.filter((n) => n.status === NotificationStatus.UNREAD)
        .length,
    [notifications],
  );

  const accessToken = user.accessToken;
  if (!accessToken) {
    console.error("Access token is missing");
    return null;
  }

  const {
    data: userNotifications = [],
    isLoading,
    isError,
  } = useGetUserNotifications(accessToken);

  // Initialize auth socket for all users
  const authSocket = useSocketWithAuth("auth", accessToken);

  // Initialize admin socket conditionally
  let adminSocket = null;
  if (isAdmin) {
    adminSocket = useSocketWithAuth("admin", accessToken);
  }

  useEffect(() => {
    if (
      userNotifications &&
      JSON.stringify(userNotifications) !== JSON.stringify(notifications)
    ) {
      const notificationsArray = Array.isArray(userNotifications)
        ? userNotifications
        : (userNotifications as GetNotificationResponse).data || [];

      setNotifications(notificationsArray as Notification[]);
    }
  }, [userNotifications, notifications]);

  // Handle user notifications
  useEffect(() => {
    if (!authSocket) return;

    const handleUserNotification = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    };

    authSocket.on(`user:${user.id}`, handleUserNotification);

    return () => {
      authSocket.off(`user:${user.id}`, handleUserNotification);
    };
  }, [authSocket, user.id]);

  // Handle admin notifications - only runs if adminSocket exists
  useEffect(() => {
    if (!adminSocket) return;

    const handleAdminNotification = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    };

    adminSocket.on("admin", handleAdminNotification);

    return () => {
      adminSocket.off("admin", handleAdminNotification);
    };
  }, [adminSocket]);

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
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <DropdownMenuItem className="text-muted-foreground text-center">
            Loading...
          </DropdownMenuItem>
        ) : isError ? (
          <DropdownMenuItem className="text-muted-foreground text-center">
            Error fetching notifications
          </DropdownMenuItem>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={`${notification.notification_id}-${notification.created_at}`}
              className="flex flex-col items-start gap-1 p-4"
            >
              <div className="flex w-full justify-between">
                <span className="font-medium">{notification.type}</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
              <span className="text-muted-foreground text-sm">
                {notification.message}
              </span>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem className="text-muted-foreground text-center">
            No new notifications
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full text-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
