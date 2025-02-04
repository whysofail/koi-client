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
import NotificationList from "./(notifications)/NotificationList";

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

  const {
    data: userNotifications = [],
    isLoading,
    isError,
  } = useGetUserNotifications(accessToken);

  // Initialize auth socket for all users
  const socket = useSocketWithAuth(isAdmin ? "admin" : "auth", accessToken);

  useEffect(() => {
    if (!userNotifications) return;

    // Avoid unnecessary state updates by checking existing notifications
    setNotifications((prev) => {
      const newNotifications = Array.isArray(userNotifications)
        ? userNotifications
        : (userNotifications as GetNotificationResponse).data || [];

      const isDifferent = newNotifications.some(
        (newNotif) =>
          !prev.some(
            (prevNotif) =>
              prevNotif.notification_id === newNotif.notification_id,
          ),
      );

      return isDifferent ? (newNotifications as Notification[]) : prev;
    });
  }, [userNotifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: Notification) => {
      setNotifications((prev) => {
        // Prevent duplicate notifications
        if (prev.some((n) => n.notification_id === data.notification_id)) {
          return prev;
        }
        return [data, ...prev];
      });
    };

    const eventChannel = isAdmin ? "admin" : `user:${user.id}`;
    socket.on(eventChannel, handleNotification);

    return () => {
      socket.off(eventChannel, handleNotification);
    };
  }, [socket, user.id, isAdmin]);

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
        ) : (
          <NotificationList notifications={notifications} />
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
