"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationItem from "./NotificationItem";
import useNotificationViewModel from "@/components/dashboard/(notifications)/NotificationDropdown.viewModel";
import NotificationListSkeleton from "@/components/skeletons/NotificationListSkeleton";

export default function NotificationList({ token }: { token: string }) {
  const [filter, setFilter] = useState("all");
  const {
    notifications,
    isNotificationsLoading,
    handleMarkAsRead,
    handleMarkAllAsRead,
    isMarkingAllAsRead,
    isMarkingAsRead,
  } = useNotificationViewModel({ token, authSocket: null });

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    return filter === "read"
      ? notification.status === "READ"
      : notification.status === "UNREAD";
  });

  if (isNotificationsLoading) {
    return <NotificationListSkeleton />;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Select onValueChange={setFilter} defaultValue={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter notifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleMarkAllAsRead}
          disabled={isMarkingAllAsRead || notifications.length === 0}
        >
          Mark All as Read
        </Button>
      </div>
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <NotificationItem
            key={notification.notification_id}
            notification={notification}
            onMarkAsRead={() => handleMarkAsRead(notification.notification_id)}
            isMarkingAsRead={isMarkingAsRead}
          />
        ))}
      </div>
      {filteredNotifications.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No notifications found</p>
      )}
    </div>
  );
}
