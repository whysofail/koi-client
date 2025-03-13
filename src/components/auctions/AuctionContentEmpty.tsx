import React, { FC } from "react";
import { Package } from "lucide-react";

const AuctionContentEmpty: FC<{ page: number }> = () => {
  return (
    <div className="container mx-auto px-4 py-8 pb-28">
      <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <Package className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
          No Auctions Available
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          There are currently no active auctions. Please check back later for
          new listings.
        </p>
      </div>
    </div>
  );
};

export default AuctionContentEmpty;
