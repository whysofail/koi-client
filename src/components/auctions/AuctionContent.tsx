"use client";

import type { FC } from "react";
import AuctionCard from "./AuctionCard";
import AuctionContentSkeleton from "../skeletons/AuctionContentSkeleton";
import AuctionContentError from "./AuctionContentError";
import AuctionContentEmpty from "./AuctionContentEmpty";
import useAuctionContentViewModel from "./AuctionContent.viewModel";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";

type AuctionContentProps = {
  token?: string;
};

const AuctionContent: FC<AuctionContentProps> = ({ token }) => {
  const {
    auctionData,
    isLoading,
    isError,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    isPendingAdd,
    isPendingRemove,
    // Pagination-related props
    currentPage,
    totalPages,
    handlePageChange,
    getPageNumbers,
    // Filter-related props
    activeFilters,
    toggleFilter,
    // Sort-related props
    sortOrder,
    toggleSortOrder,
  } = useAuctionContentViewModel({
    token,
  });

  if (isLoading) return <AuctionContentSkeleton />;
  if (isError) return <AuctionContentError />;
  if (!auctionData?.data.length)
    return <AuctionContentEmpty page={currentPage} />;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-grow px-4 py-8">
        {/* Filter and Sort UI */}
        <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <h2 className="mb-3 text-xl font-semibold dark:text-white sm:mb-0">
            Auctions
          </h2>
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <button
                onClick={() => toggleFilter("published")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilters.published
                    ? "bg-[#E8D5B0] text-red-800 dark:bg-[#6a5c41] dark:text-red-300"
                    : "bg-transparent text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Published
              </button>
              <button
                onClick={() => toggleFilter("started")}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilters.started
                    ? "bg-[#E8D5B0] text-red-800 dark:bg-[#6a5c41] dark:text-red-300"
                    : "bg-transparent text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Started
              </button>
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={toggleSortOrder}
              className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <span>Sort</span>
              {sortOrder === "DESC" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

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

      {/* Pagination - positioned normally in the document flow */}
      <div className="border-t border-gray-200 py-6 dark:border-gray-700">
        <div className="container mx-auto flex items-center justify-center gap-4 px-4">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center rounded-full bg-[#E8D5B0] px-5 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-[#d8c5a0] disabled:opacity-50 dark:bg-[#6a5c41] dark:text-red-300 dark:hover:bg-[#7a6c51]"
            aria-label="Previous page"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span>Previous</span>
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <button
                key={index}
                onClick={() => handlePageChange(pageNum)}
                className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? "bg-[#E8D5B0] text-red-800 dark:bg-[#6a5c41] dark:text-red-300"
                    : "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {pageNum}
              </button>
            ) : (
              <span key={index} className="text-gray-500 dark:text-gray-400">
                {pageNum}
              </span>
            ),
          )}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage >= totalPages}
            className="flex items-center rounded-full bg-[#E8D5B0] px-5 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-[#d8c5a0] disabled:opacity-50 dark:bg-[#6a5c41] dark:text-red-300 dark:hover:bg-[#7a6c51]"
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionContent;
