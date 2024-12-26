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

const notifications = [
  {
    id: 1,
    title: "New bid on Vintage Watch",
    description: "Someone outbid you by $50",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    title: "Auction ending soon",
    description: "Art Print auction ends in 1 hour",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Won auction",
    description: "You won the Antique Vase auction!",
    time: "2 hours ago",
    unread: false,
  },
];

const NotificationsDropdown: FC = () => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="flex flex-col items-start gap-1 p-4"
          >
            <div className="flex w-full justify-between">
              <span className="font-medium">{notification.title}</span>
              <span className="text-muted-foreground text-xs">
                {notification.time}
              </span>
            </div>
            <span className="text-muted-foreground text-sm">
              {notification.description}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full text-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
