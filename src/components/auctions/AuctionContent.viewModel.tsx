"use client";

import useAddWishlist from "@/server/wishlist/addToWishlist/mutation";
import useRemoveFromWishlist from "@/server/wishlist/removeFromWishlist/mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import { AuctionOrderBy, AuctionStatus } from "@/types/auctionTypes";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface UseWishlistCardViewModelProps {
  token?: string;
}

const useAuctionContentViewModel = ({
  token,
}: UseWishlistCardViewModelProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;

  // Parse filter params from URL
  const filterParam = searchParams.get("status") || "published,started";
  const activeFilters = useMemo(() => {
    const filters = filterParam.split(",");
    return {
      published: filters.includes("published"),
      started: filters.includes("started"),
    };
  }, [filterParam]);

  // Get sort order from URL
  const sortOrder = searchParams.get("order") || "DESC";

  // Convert filter state to AuctionStatus array for the API
  const statusFilters = useMemo(() => {
    const filters: AuctionStatus[] = [];
    if (activeFilters.published) filters.push(AuctionStatus.PUBLISHED);
    if (activeFilters.started) filters.push(AuctionStatus.STARTED);
    // If no filters selected, default to both
    if (filters.length === 0) {
      return [AuctionStatus.PUBLISHED, AuctionStatus.STARTED];
    }
    return filters;
  }, [activeFilters]);

  const {
    data: auctionData,
    isLoading,
    isError,
  } = useGetAllAuctions({
    page: currentPage,
    limit: pageSize,
    orderBy: AuctionOrderBy.CREATED_AT,
    order: sortOrder as "ASC" | "DESC",
    status: statusFilters,
    token: token ?? undefined,
  });

  const { mutate: addToWishlist, isPending: isPendingAdd } = useAddWishlist(
    token ?? "",
    queryClient,
  );
  const { mutate: removeFromWishlist, isPending: isPendingRemove } =
    useRemoveFromWishlist(token ?? "", queryClient);

  const handleAddToWishlist = (auctionId: string) => {
    addToWishlist(
      { auctionId },
      {
        onSettled: () => {
          toast.success("Added to wishlist");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const handleRemoveFromWishlist = (auctionId: string) => {
    removeFromWishlist(
      { auctionId },
      {
        onSettled: () => {
          toast.success("Removed from wishlist");
        },
      },
    );
  };

  // Filter toggle handler
  const toggleFilter = useCallback(
    (filterType: "published" | "started") => {
      const newFilters = { ...activeFilters };
      newFilters[filterType] = !newFilters[filterType];

      // Ensure at least one filter is active
      if (!newFilters.published && !newFilters.started) {
        newFilters[filterType] = true;
      }

      // Update URL params
      const params = new URLSearchParams(searchParams.toString());
      const filterValue = Object.entries(newFilters)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key)
        .join(",");

      params.set("status", filterValue);
      // Reset to page 1 when filters change
      params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [activeFilters, router, searchParams],
  );

  // Sort order toggle handler
  const toggleSortOrder = useCallback(() => {
    const newOrder = sortOrder === "DESC" ? "ASC" : "DESC";

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    params.set("order", newOrder);
    // Reset to page 1 when sort order changes
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [sortOrder, router, searchParams]);

  // Pagination logic
  const totalItems = auctionData?.count || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate start and end of page range to show
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(4, totalPages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always include last page if it's not already included
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return {
    auctionData,
    isError,
    isLoading,
    isPendingAdd,
    handleAddToWishlist,
    isPendingRemove,
    handleRemoveFromWishlist,
    // Pagination-related returns
    currentPage,
    totalPages,
    handlePageChange,
    getPageNumbers,
    // Filter-related returns
    activeFilters,
    toggleFilter,
    // Sort-related returns
    sortOrder,
    toggleSortOrder,
  };
};

export default useAuctionContentViewModel;
