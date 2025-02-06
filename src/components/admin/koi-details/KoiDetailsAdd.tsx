import React, { FC } from "react";

interface KoiData {
  code: string | null;
  nickname: string | null;
  gender: string | null;
  breeder: string | null;
  variety: string | null;
  size: string | null;
}

interface KoiDetailsProps {
  koiID: string;
  koiData: KoiData;
}

const KoiDetailsAdd: FC<KoiDetailsProps> = ({ koiData }) => {
  const renderValue = (value: string | null) => value || "-";

  return (
    <div className="flex min-h-[24rem] flex-col space-y-4 md:h-full">
      <div className="rounded-xl border p-3 dark:border-neutral-700 md:p-4">
        <h2 className="text-lg font-semibold md:text-xl">Koi Details</h2>
        <dl className="mt-3 space-y-2 md:mt-4">
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Code</dt>
            <dd className="text-sm font-medium">{renderValue(koiData.code)}</dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Nickname</dt>
            <dd className="text-sm font-medium">
              {renderValue(koiData.nickname)}
            </dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Variety</dt>
            <dd className="text-sm font-medium">
              {renderValue(koiData.variety)}
            </dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Size</dt>
            <dd className="text-sm font-medium">{renderValue(koiData.size)}</dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Breeder</dt>
            <dd className="text-sm font-medium">
              {renderValue(koiData.breeder)}
            </dd>
          </div>
          <div className="grid grid-cols-2">
            <dt className="text-muted-foreground text-sm">Gender</dt>
            <dd className="text-sm font-medium">
              {renderValue(koiData.gender)}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex-1 overflow-hidden rounded-lg border dark:border-neutral-700">
        FOR IMAGE
      </div>
    </div>
  );
};

export default KoiDetailsAdd;
