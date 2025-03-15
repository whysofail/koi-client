"use client";

import { type FC, useState } from "react";
import AuctionCard from "./AuctionCard";
import AuctionContentSkeleton from "../skeletons/AuctionContentSkeleton";
import AuctionContentError from "./AuctionContentError";
import AuctionContentEmpty from "./AuctionContentEmpty";
import useAuctionContentViewModel from "./AuctionContent.viewModel";

type AuctionContentProps = {
  token?: string;
};

const AuctionContent: FC<AuctionContentProps> = ({ token }) => {
  const [page, setPage] = useState(1);

  const {
    auctionData,
    isLoading,
    isError,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    isPendingAdd,
    isPendingRemove,
  } = useAuctionContentViewModel({
    token,
  });

  if (isLoading) return <AuctionContentSkeleton />;
  if (isError) return <AuctionContentError />;
  if (!auctionData?.data.length) return <AuctionContentEmpty page={page} />;

  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-28">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {auctionData.data.map((item) => (
            <AuctionCard
              key={item.auction_id}
              auction={item}
              onAddToWishlist={handleAddToWishlist}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              isPendingWishlist={isPendingAdd || isPendingRemove}
            />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/90 py-3 shadow-md backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/90">
        <div className="container mx-auto flex justify-between px-4">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-full bg-[#E8D5B0] px-6 py-2 text-red-800 transition-colors hover:bg-[#d8c5a0] disabled:opacity-50 dark:bg-[#6a5c41] dark:text-red-300 dark:hover:bg-[#7a6c51]"
          >
            {"<"} Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-full bg-[#E8D5B0] px-6 py-2 text-red-800 transition-colors hover:bg-[#d8c5a0] disabled:opacity-50 dark:bg-[#6a5c41] dark:text-red-300 dark:hover:bg-[#7a6c51]"
          >
            Next {">"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuctionContent;
