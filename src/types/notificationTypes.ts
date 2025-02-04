export enum NotificationType {
  BID = "BID",
  AUCTION = "AUCTION",
  SYSTEM = "SYSTEM",
  TRANSACTION = "TRANSACTION",

  // Add other notification types as needed
}

export enum NotificationStatus {
  PENDING = "PENDING",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
  UNREAD = "UNREAD",
}

export enum NotificationRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface FetchAllNotificationParams {
  user_id?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  role?: NotificationRole;
}

export interface Notification {
  notification_id: string; // UUID of the notification
  user: {
    user_id: string;
    name: string;
    email: string;
  };
  type: NotificationType;
  message: string | null; // The message can be null, hence we allow that
  reference_id: string | null; // The reference_id can be null if not associated with anything
  status: NotificationStatus;
  role: NotificationRole;
  created_at: string; // Typically ISO string for Date on frontend
  updated_at: string | null; // Optional field, could be null if not updated
}

export interface GetNotificationResponse {
  data: Notification[];
}
