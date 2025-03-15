"use client";
import { FC, useState, useMemo, memo } from "react";
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
import NotificationList from "./Notifications/NotificationDropdownList";
import { useSocket } from "@/hooks/use-socket";
import useNotificationViewModel from "./Notifications/NotificationDropdown.viewModel";
import Link from "next/link";

interface NotificationsDropdownProps {
  user: User;
}

// Memoized list item to prevent unnecessary renders

const NotificationsDropdown: FC<NotificationsDropdownProps> = memo(
  ({ user }) => {
    const accessToken = user.accessToken;
    const [open, setOpen] = useState(false);

    // Socket setup
    const { authSocket } = useSocket(accessToken);

    // Notification ViewModel with memoization
    const {
      notifications,
      unreadCount,
      isNotificationsLoading,
      notificationsError,
      handleMarkAsRead,
      handleMarkAllAsRead,
      isMarkingAsRead,
    } = useNotificationViewModel({ token: accessToken, authSocket });

    const displayedNotifications = useMemo(() => {
      return notifications.slice(0, 5);
    }, [notifications]);

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
            <DropdownMenuItem className="text-center text-muted-foreground">
              Loading...
            </DropdownMenuItem>
          ) : notificationsError ? (
            <DropdownMenuItem className="text-center text-muted-foreground">
              Error fetching notifications
            </DropdownMenuItem>
          ) : displayedNotifications.length === 0 ? (
            <DropdownMenuItem className="text-center text-muted-foreground">
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
              <Link href="/dashboard/notifications">
                View all notifications
              </Link>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

NotificationsDropdown.displayName = "NotificationsDropdown";

export default NotificationsDropdown;
