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

      queryClient.setQueryData<GetNotificationResponse>(
        ["notifications"],
        (oldData) => {
          if (!oldData) return undefined;

          const baseResponse = {
            count: oldData.count,
            page: oldData.page,
            limit: oldData.limit,
          };

          switch (data.type) {
            case "CREATE":
              return {
                ...baseResponse,
                data: [data.data, ...oldData.data],
                count: oldData.count + 1,
              };

            case "UPDATE":
              return {
                ...baseResponse,
                data: oldData.data.map((notification) =>
                  notification.notification_id === data.data.notification_id
                    ? data.data
                    : notification,
                ),
              };

            case "DELETE":
              return {
                ...baseResponse,
                data: oldData.data.filter(
                  (notification) =>
                    notification.notification_id !== data.data.notification_id,
                ),
                count: oldData.count - 1,
              };

            default:
              return oldData;
          }
        },
      );
    };

    // Subscribe to socket events
    authSocket.on("update", handleUpdate);

    return () => {
      authSocket.off("update", handleUpdate);
    };
  }, [authSocket, queryClient]);
};
