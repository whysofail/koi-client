"use client";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import { AuctionOrderBy } from "@/types/auctionTypes";
import { useState } from "react";
import AuctionCard from "@/components/auctions/AuctionCard";

export default function AuctionPage() {
  const [page, setPage] = useState(1);
  const {
    data: auctionData,
    isLoading,
    error,
  } = useGetAllAuctions({
    page,
    limit: 8,
    orderBy: AuctionOrderBy.CREATED_AT,
    order: "DESC",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading auctions</div>;
  if (!auctionData?.data) return <div>No auctions available</div>;

  return (
    <div className="flex flex-col dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 pb-28">
        {/* Auction Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {auctionData.data.map((item) => (
            <AuctionCard key={item.auction_id} auction={item} />
          ))}
        </div>
      </div>

      {/* Pagination - positioned above footer but still sticky when scrolling */}
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
            // disabled={!auctionData.pagination?.has_more}
            className="rounded-full bg-[#E8D5B0] px-6 py-2 text-red-800 transition-colors hover:bg-[#d8c5a0] disabled:opacity-50 dark:bg-[#6a5c41] dark:text-red-300 dark:hover:bg-[#7a6c51]"
          >
            Next {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
