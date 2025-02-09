import { getServerSession } from "@/lib/serverSession";
import NotificationList from "@/components/shared/notification-list/NotificationList";

const NotificationPage = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2>Notifications</h2>
      <p>Token: {token}</p>
      <NotificationList />
    </div>
  );
};

export default NotificationPage;
