"use client";

import { useEffect, useState, useCallback } from "react";
import { useNewsList } from "@/server/news/queries"; // Adjust the import path as needed

export enum ScreenSize {
  Mobile = "mobile",
  Tablet = "tablet",
  Desktop = "desktop",
}

// Custom hook for detecting screen size
const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(ScreenSize.Desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize(ScreenSize.Mobile);
      } else if (window.innerWidth < 1024) {
        setScreenSize(ScreenSize.Tablet);
      } else {
        setScreenSize(ScreenSize.Desktop);
      }
    };

    // Set initial size
    handleResize();

    // Add event listener with debounce for better performance
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  return screenSize;
};

export const useNewsSectionViewModel = () => {
  const screenSize = useScreenSize();
  const [currentPage, setCurrentPage] = useState(1);

  // Use the provided API hook
  const { data, isLoading, error } = useNewsList(currentPage);

  // Log any errors for debugging
  if (error) {
    console.error("Error fetching news:", error);
  }

  // Extract news items and pagination info from the API response
  // The data is nested inside data.data
  console.log("API Response:", data);

  // Access the nested data structure correctly
  const newsItems = Array.isArray(data?.data?.data) ? data?.data?.data : [];
  const totalPages = data?.data?.last_page || 1;

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Update the return statement to include more debugging info
  return {
    screenSize,
    newsItems,
    isLoading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    rawData: data, // Include the raw data for debugging
  };
};
