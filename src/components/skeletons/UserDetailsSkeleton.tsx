import React, { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { User, Mail, Wallet } from "lucide-react";

const UserDetailsSkeleton: FC = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
        </div>
        <Skeleton className="h-10 w-24" />
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
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">
                  Registration Date
                </p>
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20" />
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
                <Skeleton className="h-5 w-48" />
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
                <Skeleton className="h-8 w-36" />
              </div>
              <div className="grid gap-1.5">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <Skeleton className="h-5 w-40" />
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
          <Skeleton className="h-10 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default UserDetailsSkeleton;
