"use client";

import React, { FC } from "react";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { Skeleton } from "@/components/ui/skeleton";

const KoiDetails: FC<{ koiID: string }> = ({ koiID }) => {
  const { data, isLoading } = useGetKoiByID(koiID);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <Skeleton className="h-6 w-32" />
          <div className="mt-4 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="aspect-video rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[24rem] flex-col space-y-4 md:h-full">
      <div className="rounded-lg border p-3 md:p-4">
        <h2 className="text-lg font-semibold md:text-xl">Koi Details</h2>
        <dl className="mt-3 space-y-2 md:mt-4">
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Code</dt>
            <dd className="text-sm font-medium">{data?.code}</dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Nickname</dt>
            <dd className="text-sm font-medium">{data?.nickname || "-"}</dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Variety</dt>
            <dd className="text-sm font-medium">{data?.variety.name}</dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Size</dt>
            <dd className="text-sm font-medium">{data?.size}</dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Breeder</dt>
            <dd className="text-sm font-medium">{data?.breeder.name}</dd>
          </div>
        </dl>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border">FOR IMAGE</div>
    </div>
  );
};

export default KoiDetails;
