"use client";

import React, { FC } from "react";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";

const KoiDetails: FC<{ koiID: string }> = ({ koiID }) => {
  const { data } = useGetKoiByID(koiID);
  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <h2 className="font-semibold">Koi Details</h2>
        <dl className="mt-4 space-y-2">
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
      <div className="aspect-video overflow-hidden rounded-lg border">
        FOR IMAGE
      </div>
    </div>
  );
};

export default KoiDetails;
