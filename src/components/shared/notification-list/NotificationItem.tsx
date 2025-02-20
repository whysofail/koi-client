import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { Notification, NotificationType } from "@/types/notificationTypes";

import { useRouter } from "next/navigation";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead: boolean;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
  isMarkingAsRead,
}: NotificationItemProps) {
  const { status, created_at, type, message } = notification;
  const router = useRouter();
  const generateUrl = (type: NotificationType, referenceId: string) => {
    switch (type) {
      case NotificationType.AUCTION:
        return `/auction/${referenceId}`;
      case NotificationType.SYSTEM:
        return `/dashboard/user/${referenceId}`;
      case NotificationType.BID:
        return `/dashboard/auction/${referenceId}`;
      case NotificationType.TRANSACTION:
        return `/dashboard/transactions/${referenceId}`;
      default:
        return "#"; // Default URL if type does not match any case
    }
  };
  const handleClick = () => {
    if (!isMarkingAsRead) {
      onMarkAsRead(notification.notification_id);
      const notificationUrl = notification.reference_id
        ? generateUrl(notification.type, notification.reference_id)
        : "#";
      router.push(notificationUrl);
    }
  };
  return (
    <div
      onClick={handleClick}
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
