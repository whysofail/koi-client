import { getServerSession } from "@/lib/serverSession";
import UserDetailsContent from "@/components/admin/user-details-content/UserDetailsContent";

const UserDetails = async ({
  params,
}: {
  params: Promise<{ userID: string }>;
}) => {
  const userId = (await params).userID;
  const session = await getServerSession();
  const token = session?.user?.accessToken ?? "";

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <UserDetailsContent userId={userId} token={token} />
    </div>
  );
};

export default UserDetails;
