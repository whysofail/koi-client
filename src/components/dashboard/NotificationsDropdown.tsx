"use client";

import { FC, useEffect, useState } from "react";
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
import NotificationList from "./(notifications)/NotificationDropdownList";
import { useSocket } from "@/hooks/use-socket";
import useNotificationViewModel from "./(notifications)/NotificationDropdown.viewModel";
import { Notification } from "@/types/notificationTypes";
import Link from "next/link";

interface NotificationsDropdownProps {
  user: User;
}

const NotificationsDropdown: FC<NotificationsDropdownProps> = ({ user }) => {
  const accessToken = user.accessToken;
  const [open, setOpen] = useState(false);

  // Socket setup
  const { authSocket } = useSocket(accessToken);

  // Notification ViewModel
  const {
    notifications,
    isNotificationsLoading,
    notificationsError,
    handleMarkAsRead,
    handleMarkAllAsRead,
    isMarkingAsRead,
  } = useNotificationViewModel({ token: accessToken, authSocket });

  // State for unread count
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(
      notifications.filter((n: Notification) => n.status === "UNREAD").length,
    );
  }, [notifications]);

  // Limit displayed notifications to 5
  const displayedNotifications = notifications.slice(0, 5);

  const handleViewAll = () => {
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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

          <Button
            disabled={isMarkingAsRead || unreadCount === 0}
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs"
          >
            Mark all as read
          </Button>
        </div>
        <DropdownMenuSeparator />
        {isNotificationsLoading ? (
          <DropdownMenuItem className="text-muted-foreground text-center">
            Loading...
          </DropdownMenuItem>
        ) : notificationsError ? (
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
            onMarkAsRead={handleMarkAsRead}
            isMarkingAsRead={isMarkingAsRead}
          />
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full cursor-pointer text-center">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="flex w-full justify-center text-center"
            onClick={handleViewAll}
          >
            <Link href="/dashboard/notifications">View all notifications</Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
