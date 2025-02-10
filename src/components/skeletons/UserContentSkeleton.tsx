import React, { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const UserContentSkeleton: FC = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="h-[400px] w-full rounded-lg" />
      <div className="space-y-6">
        <Card>
          <CardContent className="grid gap-4 p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-40" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-[1px] w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-[1px] w-full" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="mb-4 h-5 w-24" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserContentSkeleton;
