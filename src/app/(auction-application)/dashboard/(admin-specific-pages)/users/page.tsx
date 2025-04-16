import React, { FC } from "react";
import { getServerSession } from "@/lib/serverSession";
import UsersTable from "@/components/admin/users-table/UsersTable";
import AdminUserDialog from "@/components/admin/admin-user-registration/AdminUserRegistrationForm";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "User Management",
  description: "User Management",
};

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
        {session && session.user.role === "admin" && (
          <AdminUserDialog token={token}>
            <Button className="mb-2">
              <Upload size={16} />
              <span className="ml-2">Create Admin User</span>
            </Button>
          </AdminUserDialog>
        )}

        <UsersTable token={token} />
      </div>
    </>
  );
};

export default UserManagement;
