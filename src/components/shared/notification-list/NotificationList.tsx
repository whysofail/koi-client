"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationItem from "./NotificationItem";
import { Loader2 } from "lucide-react";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  timestamp: string;
}

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = async (pageNum: number, filterType: string) => {
    setLoading(true);
    // Simulating an API call to fetch notifications
    // In a real application, you would make an API call here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    const mockNotifications: Notification[] = Array.from(
      { length: 10 },
      (_, i) => ({
        id: (pageNum - 1) * 10 + i + 1,
        message: `Notification ${(pageNum - 1) * 10 + i + 1}`,
        isRead: Math.random() > 0.5,
        timestamp: new Date(
          Date.now() - Math.floor(Math.random() * 10000000000),
        ).toISOString(),
      }),
    );

    const filteredNotifications =
      filterType === "all"
        ? mockNotifications
        : mockNotifications.filter((n) =>
            filterType === "read" ? n.isRead : !n.isRead,
          );

    setNotifications((prev) =>
      pageNum === 1
        ? filteredNotifications
        : [...prev, ...filteredNotifications],
    );
    setHasMore(filteredNotifications.length === 10);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications(page, filter);
  }, [page, filter]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
    setNotifications([]);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  return (
    <div>
      <div className="mb-4">
        <Select onValueChange={handleFilterChange} defaultValue={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter notifications" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unread">Unread</SelectItem>
            <SelectItem value="read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={handleMarkAsRead}
          />
        ))}
      </div>
      {loading && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      {!loading && hasMore && (
        <div className="mt-4 flex justify-center">
          <Button onClick={handleLoadMore}>Load More</Button>
        </div>
      )}
      {!loading && !hasMore && notifications.length > 0 && (
        <p className="mt-4 text-center text-gray-500">No more notifications</p>
      )}
      {!loading && notifications.length === 0 && (
        <p className="mt-4 text-center text-gray-500">No notifications found</p>
      )}
    </div>
  );
}
