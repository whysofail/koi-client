"use client";

import React from "react";
import WarningsTable from "@/components/admin/warnings-table/WarningsTable";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Mail,
  Phone,
  Shield,
  User,
  Users,
  Wallet,
} from "lucide-react";
import UserStatusBadge from "@/components/admin/users-table/UserStatusBadge";
import { FC } from "react";
import UserDetailsSkeleton from "@/components/skeletons/UserDetailsSkeleton";
import BackButton from "@/components/dashboard/BackButton";
import { useUserProfileViewModel } from "@/app/(auction-application)/dashboard/(shared)/profile/UserProfile.viewModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";

const UserProfileContent: FC<{
  token: string;
}> = ({ token }) => {
  const { user, isLoading, error } = useUserProfileViewModel(token);

  if (isLoading) return <UserDetailsSkeleton />;

  if (error || !user) return <div>Error loading user details</div>;

  return (
    <>
      <BackButton />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              User Information
            </CardTitle>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Username
                  </p>
                  <p className="text-sm font-semibold">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Registration Date
                  </p>
                  <p className="text-sm font-semibold">
                    {format(user.registration_date, "dd MMMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">
                    <UserStatusBadge isBanned={user.is_banned} />
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Contact Information
            </CardTitle>
            <Mail className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm font-semibold">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm font-semibold">{user.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">
              Wallet Information
            </CardTitle>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(user.wallet.balance)}
                </p>
              </div>
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-medium">
                  {format(new Date(user.wallet.updated_at), "PPP")}
                </p>
              </div>
              <div className="grid-flow-row space-x-4">
                <Button variant="default">
                  <Link href="/dashboard/transactions/deposit" passHref>
                    Top Up
                  </Link>
                </Button>
                <Button variant="destructive">
                  <Link href="/dashboard/transactions" passHref>
                    View History
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Warning History</CardTitle>
            <CardDescription>List of warnings issued to you</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <WarningsTable warnings={user.warnings} />
        </CardContent>
      </Card>
    </>
  );
};

export default UserProfileContent;
