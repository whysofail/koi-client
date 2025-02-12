"use client";

import React, { FC } from "react";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { Skeleton } from "@/components/ui/skeleton";

interface KoiData {
  code: string | null | undefined;
  nickname: string | null | undefined;
  gender?: string | null | undefined;
  breeder: string | null | undefined;
  variety: string | null | undefined;
  size: string | null | undefined;
}

interface KoiDetailsProps {
  koiID?: string;
  koiData?: KoiData;
  isLoading?: boolean;
}

const KoiDetails: FC<KoiDetailsProps> = ({ koiID, koiData, isLoading }) => {
  const query = useGetKoiByID(koiID || "");

  if (isLoading || query.isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border p-4 dark:border-neutral-700">
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

  const displayData = koiData || {
    code: query.data?.code,
    nickname: query.data?.nickname,
    variety: query.data?.variety.name,
    size: query.data?.size,
    breeder: query.data?.breeder.name,
    gender: query.data?.gender,
  };

  const renderValue = (value: string | null | undefined) => {
    if (value === undefined || value === null) return "-";
    return value;
  };

  return (
    <div className="flex min-h-[24rem] flex-col space-y-4 md:h-full">
      <div className="rounded-xl border p-3 dark:border-neutral-700 md:p-4">
        <h2 className="text-lg font-semibold md:text-xl">Koi Details</h2>
        <dl className="mt-3 space-y-2 md:mt-4">
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Code</dt>
            <dd className="text-sm font-medium">
              {renderValue(displayData.code)}
            </dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Nickname</dt>
            <dd className="text-sm font-medium">
              {renderValue(displayData.nickname)}
            </dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Variety</dt>
            <dd className="text-sm font-medium">
              {renderValue(displayData.variety)}
            </dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Size</dt>
            <dd className="text-sm font-medium">
              {renderValue(displayData.size)}
            </dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Breeder</dt>
            <dd className="text-sm font-medium">
              {renderValue(displayData.breeder)}
            </dd>
          </div>
          {displayData.gender && (
            <div className="grid grid-cols-2">
              <dt className="text-muted-foreground text-sm">Gender</dt>
              <dd className="text-sm font-medium">
                {renderValue(displayData.gender)}
              </dd>
            </div>
          )}
        </dl>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border dark:border-neutral-700">
        FOR IMAGE
      </div>
    </div>
  );
};

export default KoiDetails;
