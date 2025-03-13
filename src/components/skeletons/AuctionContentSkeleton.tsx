import React, { FC } from "react";

const AuctionContentSkeleton: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 pb-28">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="h-48 animate-pulse rounded-t-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="mb-4 h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AuctionContentSkeleton;
