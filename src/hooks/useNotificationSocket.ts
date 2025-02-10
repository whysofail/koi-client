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
          if (!oldData) return { data: [] };

          switch (data.type) {
            case "CREATE":
              return {
                data: [data.data, ...oldData.data],
              };

            case "UPDATE":
              return {
                data: oldData.data.map((notification) =>
                  notification.notification_id === data.data.notification_id
                    ? data.data
                    : notification,
                ),
              };

            case "DELETE":
              return {
                data: oldData.data.filter(
                  (notification) =>
                    notification.notification_id !== data.data.notification_id,
                ),
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
