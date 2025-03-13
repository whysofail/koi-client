import React, { FC } from "react";
import { AlertCircle } from "lucide-react";

const AuctionContentError: FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 pb-28">
      <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500 dark:text-red-400" />
        <h3 className="mb-2 text-xl font-semibold text-red-700 dark:text-red-400">
          Unable to Load Auctions
        </h3>
        <p className="mb-6 text-red-600 dark:text-red-300">
          We encountered a problem while loading the auction data. Please try
          again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-[#E8D5B0] px-6 py-2 text-red-800 transition-colors hover:bg-[#d8c5a0] dark:bg-[#6a5c41] dark:text-red-300 dark:hover:bg-[#7a6c51]"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default AuctionContentError;
