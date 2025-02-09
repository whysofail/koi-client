import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  timestamp: string;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const { id, message, isRead, timestamp } = notification;

  return (
    <div
      className={`rounded-lg p-4 shadow ${isRead ? "bg-gray-50" : "border-l-4 border-blue-500 bg-white"}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Bell
            className={`h-6 w-6 ${isRead ? "text-gray-400" : "text-blue-500"}`}
          />
        </div>
        <div className="ml-3 flex-1">
          <p
            className={`text-sm font-medium ${isRead ? "text-gray-600" : "text-gray-900"}`}
          >
            {message}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </p>
        </div>
        {!isRead && (
          <Button
            onClick={() => onMarkAsRead(id)}
            variant="outline"
            size="sm"
            className="ml-4"
          >
            Mark as read
          </Button>
        )}
      </div>
    </div>
  );
}
