import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { Notification } from "@/types/notificationTypes";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const { notification_id, status, created_at, type, message } = notification;

  return (
    <div
      onClick={() => status === "UNREAD" && onMarkAsRead(notification_id)}
      className={`cursor-pointer rounded-lg p-4 shadow transition hover:bg-gray-100 ${
        status === "READ" ? "bg-gray-50" : "border-l-4 border-blue-500 bg-white"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Bell
            className={`h-6 w-6 ${
              status === "READ" ? "text-gray-400" : "text-blue-500"
            }`}
          />
        </div>
        <div className="ml-3 flex-1">
          <h2>{type}</h2>
          <p
            className={`text-sm font-medium ${
              status === "READ" ? "text-gray-600" : "text-gray-900"
            }`}
          >
            {message}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}
