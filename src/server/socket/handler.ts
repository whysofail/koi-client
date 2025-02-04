import { Notification } from "@/types/notificationTypes";

const handleNotificationUpdate = (data: Notification, queryClient: any) => {
  const queryKey = ["notifications", data.notification_id].filter(Boolean);
  queryClient.invalidateQueries({ queryKey });
};

const handleChatUpdate = (data: any, queryClient: any) => {
  const queryKey = ["chats", data.chatId].filter(Boolean);
  queryClient.invalidateQueries({ queryKey });
};

const handleAuctionUpdate = (data: any, queryClient: any) => {
  const queryKey = ["auctions", data.auctionId].filter(Boolean);
  queryClient.invalidateQueries({ queryKey });
};

// Mapping entity types to their handlers
export const entityHandlers: Record<
  string,
  (data: any, queryClient: any) => void
> = {
  notification: handleNotificationUpdate,
  chat: handleChatUpdate,
  auction: handleAuctionUpdate,
};
