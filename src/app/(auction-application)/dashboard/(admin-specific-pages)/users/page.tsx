import React, { FC } from "react";
import { getServerSession } from "@/lib/serverSession";
import UsersTable from "@/components/admin/users-table/UsersTable";

const UserManagement: FC = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            User Management
          </h2>
        </div>
      </div>
      <div className="mt-8 pl-5 pr-5">
        <UsersTable token={token} />
      </div>
    </>
  );
};

export default UserManagement;
