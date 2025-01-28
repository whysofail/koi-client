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

  // Memoized unread count calculation
  const unreadCount = useMemo(
    () =>
      notifications.filter((n) => n.status === NotificationStatus.UNREAD)
        .length,
    [notifications],
  );

  const accessToken = user.accessToken;
  if (!accessToken) {
    throw new Error("Access token is missing");
  }

  // Fetch notifications for both admin and user roles (same hook for both)
  const {
    data: userNotifications = [],
    isLoading,
    isError,
  } = useGetUserNotifications(accessToken);

  // Update notifications on data change
  useEffect(() => {
    if (
      userNotifications &&
      JSON.stringify(userNotifications) !== JSON.stringify(notifications)
    ) {
      // Ensure userNotifications is always an array
      const notificationsArray = Array.isArray(userNotifications)
        ? userNotifications
        : (userNotifications as GetNotificationResponse).data || [];

      setNotifications(notificationsArray as Notification[]); // Set the notifications
    }
  }, [userNotifications, notifications]);

  // Socket connections
  const authSocket = useSocketWithAuth("auth", accessToken); // Connect to authNamespace
  const adminSocket = useSocketWithAuth("admin", accessToken); // Connect to adminNamespace

  // Socket event listeners
  useEffect(() => {
    if (!authSocket || !adminSocket) return;

    const handleAdminNotification = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    };

    const handleUserNotification = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
    };

    if (user.role === "admin") {
      adminSocket.on("admin", handleAdminNotification);
    }

    authSocket.on(`user:${user.id}`, handleUserNotification);

    // Cleanup socket listeners
    return () => {
      if (user.role === "admin") {
        adminSocket.off("admin", handleAdminNotification);
      }
      authSocket.off(`user:${user.id}`, handleUserNotification);
    };
  }, [authSocket, adminSocket, user]);

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
