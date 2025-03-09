"use client";

import React from "react";
import { useUserDetailsViewModel } from "./UserDetails.viewModel";
import BanUserButton from "../user-details-dialog/BanUserButton";
import UnbanUserButton from "../user-details-dialog/UnbanUserButton";
import WarningsTable from "@/components/admin/warnings-table/WarningsTable";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, User, Wallet } from "lucide-react";
import UserStatusBadge from "@/components/admin/users-table/UserStatusBadge";
import { FC } from "react";
import WarnUserDialog from "@/components/admin/user-details-dialog/WarnUserDialog";
import UserDetailsSkeleton from "@/components/skeletons/UserDetailsSkeleton";
import BackButton from "@/components/dashboard/BackButton";

const UserDetailsContent: FC<{
  userId: string;
  token: string;
}> = ({ userId, token }) => {
  const {
    user,
    isLoading,
    error,
    handleBanUser,
    handleUnbanUser,
    isBanningUser,
    isUnbanningUser,
    handleWarnUser,
    isWarningUser,
  } = useUserDetailsViewModel(userId, token);

  if (isLoading) return <UserDetailsSkeleton />;

  if (error || !user) return <div>Error loading user details</div>;

  return (
    <>
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
        </div>
        {user.is_banned ? (
          <UnbanUserButton
            onUnban={handleUnbanUser}
            isUnbanning={isUnbanningUser}
          />
        ) : (
          <BanUserButton onBan={handleBanUser} isBanning={isBanningUser} />
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              User Information
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="text-sm font-medium">{user.username}</p>
              </div>
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">
                  Registration Date
                </p>
                <p className="text-sm font-medium">
                  {format(new Date(user.registration_date), "PPP")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <UserStatusBadge isBanned={user.is_banned} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contact Information
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wallet Information
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">
                  Rp. {Number.parseFloat(user.wallet.balance).toLocaleString()}
                </p>
              </div>
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {format(new Date(user.wallet.updated_at), "PPP")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Warning History</CardTitle>
            <CardDescription>
              List of warnings issued to this user
            </CardDescription>
          </div>
          <WarnUserDialog onWarn={handleWarnUser} isWarning={isWarningUser} />
        </CardHeader>
        <CardContent>
          <WarningsTable warnings={user.warnings} />
        </CardContent>
      </Card>
    </>
  );
};

export default UserDetailsContent;
