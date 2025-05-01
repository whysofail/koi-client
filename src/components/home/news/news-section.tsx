"use client";

import { format, parseISO } from "date-fns";
import {
  useNewsSectionViewModel,
  ScreenSize,
} from "./useNewsSection.viewModel";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";
import type { News } from "@/server/news/queries";
export default function NewsSection() {
  const {
    screenSize,
    newsItems,
    isLoading,
    currentPage,
    totalPages,
    handlePageChange,
    error,
    rawData,
  } = useNewsSectionViewModel();
  const newsSectionRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <NewsSkeletonLoader screenSize={screenSize} />;
  }

  const handlePageClick = (page: number) => {
    handlePageChange(page);
    // Use the ref to scroll to the exact position
    setTimeout(() => {
      if (newsSectionRef.current) {
        const yOffset = -20; // Adjust this value to control how far above the element to scroll
        const y =
          newsSectionRef.current.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  };

  // Function to create a plain text preview from HTML content
  const createTextPreview = (htmlContent: string, maxLength = 100) => {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // Get text content and truncate
    let text = tempDiv.textContent || tempDiv.innerText || "";
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "...";
    }

    return text;
  };

  const renderNewsItem = (item: News) => {
    const date = parseISO(item.created_at);
    const textPreview = createTextPreview(item.description);

    return (
      <Link
        href={`/news/${item.slug}`}
        key={item.id}
        className="flex cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="flex w-36 flex-col justify-center bg-white p-3 text-center text-red-600 dark:bg-gray-800 dark:text-red-300">
          <div className="text-xs font-medium">
            {format(date, "EEE, dd MMM yyyy")}
          </div>
          <div className="text-xs font-medium">{format(date, "HH:mm")}</div>
        </div>
        <div className="flex-1 p-4">
          <h3 className="mb-1 font-bold">{item.title}</h3>
          <div className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            {textPreview}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {item.type}
          </div>
        </div>
      </Link>
    );
  };

  const renderMobileItem = (item: News) => {
    const date = parseISO(item.created_at);
    const textPreview = createTextPreview(item.description);

    return (
      <Link
        href={`/news/${item.slug}`}
        key={item.id}
        className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="flex flex-col p-4">
          <div className="mb-2 text-center text-red-600 dark:text-red-300">
            <div className="text-xs font-medium">
              {format(date, "EEE, dd MMM yyyy")}
            </div>
            <div className="text-xs font-medium">{format(date, "HH:mm")}</div>
          </div>
          <div className="text-center">
            <h3 className="mb-1 font-bold">{item.title}</h3>
            <div className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {textPreview}
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {item.type}
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8" ref={newsSectionRef}>
      <div className="rounded-xl bg-[#E8D5B0] p-4 sm:p-8 dark:bg-[#6a5c41]">
        <h2 className="mb-6 mt-0 text-center text-2xl font-bold sm:mb-8 sm:text-3xl dark:text-gray-100">
          News
        </h2>

        {screenSize === ScreenSize.Desktop && (
          <div className="grid grid-cols-2 gap-4">
            {Array.isArray(newsItems) && newsItems.length > 0 ? (
              newsItems.map(renderNewsItem)
            ) : (
              <div className="col-span-2 py-8 text-center text-gray-500 dark:text-gray-400">
                No news items available
              </div>
            )}
          </div>
        )}

        {screenSize === ScreenSize.Tablet && (
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(newsItems) && newsItems.length > 0 ? (
              newsItems.map(renderNewsItem)
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No news items available
              </div>
            )}
          </div>
        )}

        {screenSize === ScreenSize.Mobile && (
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(newsItems) && newsItems.length > 0 ? (
              newsItems.map(renderMobileItem)
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No news items available
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageClick}
          />
        )}
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 max-h-40 overflow-auto rounded-lg bg-gray-100 p-4 text-xs dark:bg-gray-700">
          <pre>
            {JSON.stringify(
              { newsItems, isLoading, error: error?.message, rawData },
              null,
              2,
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`rounded-md px-3 py-1 transition-colors ${
            currentPage === i
              ? "bg-red-600 text-white dark:bg-red-700"
              : "hover:bg-red-100 dark:hover:bg-gray-700"
          }`}
          aria-current={currentPage === i ? "page" : undefined}
        >
          {i}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className="mt-6 flex items-center justify-center space-x-1 dark:text-gray-200">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-md px-2 py-1 transition-colors hover:bg-red-100 dark:hover:bg-gray-700"
          aria-label="Previous page"
        >
          «
        </button>
      )}

      {renderPageNumbers()}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center rounded-md px-2 py-1 transition-colors hover:bg-red-100 dark:hover:bg-gray-700"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function NewsSkeletonLoader({ screenSize }: { screenSize: ScreenSize }) {
  const renderSkeletonItem = () => (
    <div className="flex overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
      <div className="flex w-36 flex-col justify-center p-3 text-center">
        <Skeleton className="mx-auto mb-1 h-3 w-24" />
        <Skeleton className="mx-auto h-3 w-20" />
      </div>
      <div className="flex-1 p-4">
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="mb-2 h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );

  const renderMobileSkeletonItem = () => (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
      <div className="flex flex-col p-4">
        <div className="mb-2 text-center">
          <Skeleton className="mx-auto mb-1 h-3 w-24" />
          <Skeleton className="mx-auto h-3 w-20" />
        </div>
        <div className="text-center">
          <Skeleton className="mx-auto mb-2 h-4 w-3/4" />
          <Skeleton className="mx-auto mb-2 h-3 w-1/2" />
          <Skeleton className="mx-auto h-3 w-2/3" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-xl bg-[#E8D5B0] p-4 sm:p-8 dark:bg-[#6a5c41]">
        <h2 className="mb-6 mt-0 text-center text-2xl font-bold sm:mb-8 sm:text-3xl dark:text-gray-100">
          News
        </h2>

        {screenSize === ScreenSize.Desktop && (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>{renderSkeletonItem()}</div>
            ))}
          </div>
        )}

        {screenSize === ScreenSize.Tablet && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>{renderSkeletonItem()}</div>
            ))}
          </div>
        )}

        {screenSize === ScreenSize.Mobile && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>{renderMobileSkeletonItem()}</div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-2">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}
