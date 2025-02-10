import { getServerSession } from "@/lib/serverSession";
import NotificationList from "@/components/shared/notification-list/NotificationList";

const NotificationPage = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
        Notifications
      </h2>
      <NotificationList token={token} />
    </div>
  );
};

export default NotificationPage;
