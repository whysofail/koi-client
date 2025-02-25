import React, { FC } from "react";
import { getServerSession } from "@/lib/serverSession";
import UserProfileContent from "@/components/user/profile/UserProfile";

const UserManagement: FC = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";

  return (
    <>
      <div className="flex items-center justify-between space-y-2"></div>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <UserProfileContent token={token} />
      </div>
    </>
  );
};

export default UserManagement;
