"use client";

import React, { FC } from "react";
import useGetKoiByID from "@/server/koi/getKoiByID/queries";
import { Skeleton } from "@/components/ui/skeleton";
import SingleImageDisplay, {
  SingleImage,
} from "@/components/shared/single-image/SingleImageDisplay";
import { AlertCircle } from "lucide-react";

interface KoiData {
  code: string | null | undefined;
  nickname: string | null | undefined;
  gender?: string | null | undefined;
  breeder: string | null | undefined;
  variety: string | null | undefined;
  size: string | null | undefined;
  image?: SingleImage | null | undefined;
}

interface KoiDetailsProps {
  koiID?: string;
  koiData?: KoiData;
  isLoading?: boolean;
  image?: SingleImage;
}

const KoiDetails: FC<KoiDetailsProps> = ({ koiID, koiData, isLoading }) => {
  const query = useGetKoiByID(koiID || "");

  if (isLoading || query.isLoading) {
    return (
      <div className="flex h-full flex-col space-y-4">
        <div className="rounded-xl border p-3 dark:border-neutral-700 md:p-4">
          <Skeleton className="h-7 w-24 md:h-8" />
          <div className="mt-3 space-y-2 md:mt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-28" />
              </div>
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border dark:border-neutral-700">
          <Skeleton className="h-full min-h-[300px] w-full" />
        </div>
      </div>
    );
  }

  const imageArray = query.data?.photo?.split("|") || [];
  const imageBaseUrl = `${process.env.NEXT_PUBLIC_KOI_IMG_BASE_URL}/img/koi/photo/`;

  const koiImage: SingleImage | undefined = imageArray[0]
    ? {
        largeURL: imageBaseUrl + imageArray[0],
        thumbnailURL: imageBaseUrl + imageArray[0],
        height: 800,
        width: 400,
        alt: query.data?.nickname || query.data?.code || "Koi",
      }
    : undefined;

  const displayData = koiData || {
    code: query.data?.code,
    nickname: query.data?.nickname,
    variety: query.data?.variety.name,
    size: query.data?.size,
    breeder: query.data?.breeder.name,
    gender: query.data?.gender,
    image: koiImage,
  };

  const renderValue = (value: string | null | undefined) => {
    if (
      value === undefined ||
      value === null ||
      value === "null" ||
      value === ""
    )
      return "-";
    return value;
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="rounded-xl border p-3 dark:border-neutral-700 md:p-4">
        <h2 className="text-lg font-semibold md:text-xl">Koi Details</h2>
        {query.isError ? (
          <p className="mt-3 flex min-h-[192px] items-center justify-center gap-2 text-sm text-red-500 md:mt-4">
            <AlertCircle className="h-4 w-4" />
            Failed to load koi details. Please try again later.
          </p>
        ) : (
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
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border dark:border-neutral-700">
        <SingleImageDisplay
          className="max-h[500-px]"
          title={displayData.nickname || displayData.code || "Koi"}
          image={displayData.image!}
        />
      </div>
    </div>
  );
};

export default KoiDetails;
