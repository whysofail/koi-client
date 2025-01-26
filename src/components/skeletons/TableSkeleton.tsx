import React, { FC } from "react";
import { Skeleton } from "../ui/skeleton";

const TableSkeleton: FC = () => (
  <div className="w-full space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-[250px]" />
      <Skeleton className="h-10 w-[110px]" />
    </div>
    <div className="rounded-md border dark:border-neutral-700">
      <div className="border-b">
        <div className="flex h-10 items-center px-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="mx-4 h-4 w-[100px]" />
            ))}
        </div>
      </div>
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4">
            {Array(6)
              .fill(0)
              .map((_, j) => (
                <Skeleton key={j} className="h-4 w-[100px]" />
              ))}
          </div>
        ))}
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-[250px]" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  </div>
);

export default TableSkeleton;
