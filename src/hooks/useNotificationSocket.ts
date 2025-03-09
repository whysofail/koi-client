import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import {
  Notification,
  GetNotificationResponse,
} from "@/types/notificationTypes";

interface UseNotificationSocketProps {
  authSocket: Socket | null;
}

export const useNotificationSocket = ({
  authSocket,
}: UseNotificationSocketProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authSocket) return;

    const handleUpdate = (data: {
      entity: string;
      type: "CREATE" | "UPDATE" | "DELETE";
      data: Notification;
    }) => {
      if (data.entity !== "notification") return;

      // Get all notification queries in the cache
      const queryCache = queryClient.getQueryCache();
      const notificationQueries = queryCache.findAll({
        queryKey: ["notifications"],
      });

      // Update all notification query data regardless of pagination
      notificationQueries.forEach((query) => {
        // Extract pagination parameters from the query key
        const queryKey = query.queryKey as [
          string,
          { page: number; limit: number },
        ];
        const paginationParams = queryKey[1] || { page: 1, limit: 10 };

        queryClient.setQueryData<{ data: GetNotificationResponse }>(
          queryKey,
          (oldDataWrapper) => {
            if (!oldDataWrapper) return undefined;
            const oldData = oldDataWrapper.data;

            const baseResponse = {
              count: oldData.count,
              page: oldData.page,
              limit: oldData.limit,
            };

            switch (data.type) {
              case "CREATE":
                // Only add to first page
                if (paginationParams.page === 1) {
                  return {
                    data: {
                      ...baseResponse,
                      data: [
                        data.data,
                        ...oldData.data.slice(0, oldData.limit - 1),
                      ],
                      count: oldData.count + 1,
                    },
                  };
                }
                return {
                  data: {
                    ...baseResponse,
                    count: oldData.count + 1,
                    data: oldData.data,
                  },
                };

              case "UPDATE":
                return {
                  data: {
                    ...baseResponse,
                    data: oldData.data.map((notification) =>
                      notification.notification_id === data.data.notification_id
                        ? data.data
                        : notification,
                    ),
                  },
                };

              case "DELETE":
                return {
                  data: {
                    ...baseResponse,
                    data: oldData.data.filter(
                      (notification) =>
                        notification.notification_id !==
                        data.data.notification_id,
                    ),
                    count: oldData.count - 1,
                  },
                };

              default:
                return oldDataWrapper;
            }
          },
        );
      });

      // Update the unread count across the application
      if (data.type === "CREATE" && data.data.status === "UNREAD") {
        // Could dispatch to a global state manager if you're using one
        // Or update a specific query for unread counts
      }
    };

    // Subscribe to socket events
    authSocket.on("update", handleUpdate);

    return () => {
      authSocket.off("update", handleUpdate);
    };
  }, [authSocket, queryClient]);
};
