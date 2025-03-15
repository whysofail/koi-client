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

      // Update all notification queries (all pages)
      const queryCache = queryClient.getQueryCache();
      const notificationQueries = queryCache.findAll({
        queryKey: ["notifications"],
      });

      notificationQueries.forEach((query) => {
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
              unread_count: oldData.unread_count,
              page: oldData.page,
              limit: oldData.limit,
            };

            switch (data.type) {
              case "CREATE":
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
                        ? { ...notification, ...data.data }
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

      // ✅ Update unread count globally
      queryClient.setQueryData<number>(
        ["notifications", "unread_count"],
        (oldUnreadCount = 0) => {
          if (data.type === "CREATE" && data.data.status === "UNREAD") {
            return oldUnreadCount + 1;
          }
          if (data.type === "UPDATE" && data.data.status === "READ") {
            return Math.max(0, oldUnreadCount - 1);
          }
          return oldUnreadCount;
        },
      );

      // ✅ Ensure other pages update their notifications
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    // Subscribe to socket events
    authSocket.on("update", handleUpdate);

    return () => {
      authSocket.off("update", handleUpdate);
    };
  }, [authSocket, queryClient]);
};
