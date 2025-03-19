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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import NotificationItem from "./NotificationItem";
import useNotificationViewModel from "@/components/dashboard/Notifications/NotificationDropdown.viewModel";
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
    pageIndex,
    pageSize,
    setPageIndex,
    setPageSize,
    total,
  } = useNotificationViewModel({ token, authSocket: null });

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    return filter === "read"
      ? notification.status === "READ"
      : notification.status === "UNREAD";
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (isNotificationsLoading) {
    return <NotificationListSkeleton />;
  }

  return (
    <div className="bg-background text-foreground">
      <div className="mb-4 flex">
        <div className="flex gap-4">
          <Select onValueChange={setFilter} defaultValue={filter}>
            <SelectTrigger className="w-[180px] border-border bg-background">
              <SelectValue placeholder="Filter notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[100px] border-border bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          className="ml-auto"
          disabled={isMarkingAllAsRead || filteredNotifications.length === 0}
          variant="outline"
          onClick={handleMarkAllAsRead}
        >
          Mark all as read
        </Button>
      </div>
      <div></div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.notification_id}
            notification={notification}
            onMarkAsRead={() => handleMarkAsRead(notification.notification_id)}
            isMarkingAsRead={isMarkingAsRead}
          />
        ))}
      </div>
      {filteredNotifications.length === 0 && (
        <p className="mt-4 text-center text-muted-foreground">
          No notifications found
        </p>
      )}

      <Pagination className="mt-4 flex justify-center">
        <PaginationContent>
          <PaginationItem>
            {pageIndex > 1 && (
              <PaginationPrevious
                href="#"
                onClick={() => setPageIndex(pageIndex - 1)}
              />
            )}
          </PaginationItem>
          {(() => {
            const pageNumbers = [];
            const totalPageButtons = 5;
            let startPage = Math.max(
              1,
              pageIndex - Math.floor(totalPageButtons / 2),
            );
            const endPage = Math.min(
              totalPages,
              startPage + totalPageButtons - 1,
            );

            if (endPage - startPage + 1 < totalPageButtons) {
              startPage = Math.max(1, endPage - totalPageButtons + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(
                <PaginationItem key={i}>
                  <Button
                    variant={i === pageIndex ? "outline" : "ghost"}
                    className="h-9 w-9"
                    onClick={() => setPageIndex(i)}
                  >
                    {i}
                  </Button>
                </PaginationItem>,
              );
            }

            return pageNumbers;
          })()}
          <PaginationItem>
            {pageIndex !== totalPages && totalPages !== 0 && (
              <PaginationNext
                href="#"
                onClick={() => setPageIndex(pageIndex + 1)}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
