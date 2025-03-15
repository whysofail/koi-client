import { useCallback, useMemo, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Notification } from "@/types/notificationTypes";
import { fetchUserNotifications } from "@/server/notifications/getNotification/queries";
import { useMarkNotificationAsRead } from "@/server/notifications/markAsRead/mutation";
import { useMarkAllNotificationsAsRead } from "@/server/notifications/markAllAsRead/mutation";
import { useUserNotifications } from "@/server/notifications/getNotification/queries";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { Socket } from "socket.io-client";

interface UseNotificationViewModelProps {
  token: string;
  authSocket: Socket | null;
}

// Centralized query key generator - use a function to ensure consistency
const getNotificationsQueryKey = (page?: number, limit?: number) => {
  if (page !== undefined && limit !== undefined) {
    return ["notifications", page, limit];
  }
  return ["notifications"];
};

const useNotificationViewModel = ({
  token,
  authSocket,
}: UseNotificationViewModelProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Track previous path to detect navigation
  const prevPathRef = useRef(pathname);
  const navigationOccurred = prevPathRef.current !== pathname;

  // Update path reference
  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  // Memoize the pagination decision to prevent unnecessary recalculations
  const { shouldPaginate, pageIndex, pageSize } = useMemo(() => {
    const isOnDashboard = pathname === "/dashboard";
    return {
      shouldPaginate: isOnDashboard,
      pageIndex: isOnDashboard ? Number(searchParams.get("page")) || 1 : 1,
      pageSize: isOnDashboard ? Number(searchParams.get("limit")) || 10 : 10, // Reduced from 100 to 5 for non-dashboard views
    };
  }, [pathname, searchParams]);

  // Setup socket listening for real-time updates
  useNotificationSocket({ authSocket });

  // Memoize the query string creation function
  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params.toString();
    },
    [searchParams],
  );

  // Fetch user notifications with memoized parameters
  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
  } = useUserNotifications({
    token,
    page: pageIndex,
    limit: pageSize,
    // Disable refetching on mount when navigation has occurred
    options: {
      refetchOnMount: navigationOccurred ? false : true,
    },
  });

  // Effect to prefetch next/prev pages for smoother pagination
  useEffect(() => {
    if (shouldPaginate && token) {
      // Prefetch next page
      queryClient.prefetchQuery({
        queryKey: getNotificationsQueryKey(pageIndex + 1, pageSize),
        queryFn: () =>
          fetchUserNotifications({
            token,
            page: pageIndex + 1,
            limit: pageSize,
          }),
      });

      // Prefetch previous page if not on page 1
      if (pageIndex > 1) {
        queryClient.prefetchQuery({
          queryKey: getNotificationsQueryKey(pageIndex - 1, pageSize),
          queryFn: () =>
            fetchUserNotifications({
              token,
              page: pageIndex - 1,
              limit: pageSize,
            }),
        });
      }
    }
  }, [pageIndex, pageSize, shouldPaginate, token, queryClient]);

  // Memoize the notifications data to avoid unnecessary rerenders
  const notificationData = useMemo(() => {
    return notifications?.data.data || [];
  }, [notifications]);

  // Memoize unread count calculation
  const unreadCount = useMemo(() => {
    return notifications?.data.unread_count || 0; // Use server-provided total if available
  }, [notifications]);

  // Mutation to mark a single notification as read
  const { mutate: markAsRead, isPending: isMarkingAsRead } =
    useMarkNotificationAsRead(token);

  // Mutation to mark all notifications as read
  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } =
    useMarkAllNotificationsAsRead(token);

  // Optimistic update utility for marking a single notification as read
  const optimisticMarkAsRead = useCallback(
    (notificationId: string) => {
      queryClient.setQueriesData(
        { queryKey: ["notifications"] },
        (oldData: any) => {
          if (!oldData) return oldData;

          const newData = {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map((notification: Notification) =>
                notification.notification_id === notificationId
                  ? { ...notification, status: "READ" }
                  : notification,
              ),
              // Also decrement the total_unread count if it exists
              total_unread: Math.max(0, (oldData.data.total_unread || 0) - 1),
            },
          };

          return newData;
        },
      );
    },
    [queryClient],
  );

  // Handler for marking a single notification as read with optimistic updates
  const handleMarkAsRead = useCallback(
    (notificationId: string) => {
      optimisticMarkAsRead(notificationId);
      markAsRead(notificationId, {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        onError: () => {
          // Revert optimistic update on error
          queryClient.invalidateQueries({
            queryKey: ["notifications"],
          });
        },
      });
    },
    [markAsRead, optimisticMarkAsRead, queryClient],
  );

  // Handler for marking all notifications as read with optimistic updates
  const handleMarkAllAsRead = useCallback(() => {
    queryClient.setQueriesData(
      { queryKey: ["notifications"] },
      (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((notification: Notification) => ({
              ...notification,
              status: "READ",
            })),
            total_unread: 0, // Reset unread count to zero
          },
        };
      },
    );

    markAllAsRead(undefined, {
      onError: () => {
        // Revert optimistic update on error
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      },
    });
  }, [markAllAsRead, queryClient]);

  // Memoized pagination handlers
  const setPageIndex = useCallback(
    (page: number) => {
      if (!shouldPaginate) return;
      router.push(`?${createQueryString({ page: page.toString() })}`);
    },
    [createQueryString, router, shouldPaginate],
  );

  const setPageSize = useCallback(
    (limit: number) => {
      if (!shouldPaginate) return;
      router.push(
        `?${createQueryString({ limit: limit.toString(), page: "1" })}`,
      );
    },
    [createQueryString, router, shouldPaginate],
  );

  // Memoized refetch function
  const refetchNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  return {
    notifications: notificationData,
    unreadCount,
    isNotificationsLoading,
    notificationsError,
    handleMarkAsRead,
    handleMarkAllAsRead,
    isMarkingAsRead,
    isMarkingAllAsRead,
    refetchNotifications,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    total: notifications?.data.count || 0,
  };
};

export default useNotificationViewModel;
