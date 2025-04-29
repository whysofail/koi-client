"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useState } from "react";

// Sample data with timestamps
const newsItems = [
  {
    id: 1,
    title: "Auction Winner",
    username: "",
    auctionTitle: "Description",
    timestamp: new Date("2025-08-29T16:30:00+07:00"),
  },
  {
    id: 2,
    title: "Next Event",
    username: "",
    auctionTitle: "Description",
    timestamp: new Date("2025-08-29T16:30:00+07:00"),
  },
  {
    id: 3,
    title: "Current Auction",
    username: "",
    auctionTitle: "Description",
    timestamp: new Date("2025-08-29T16:30:00+07:00"),
  },
  {
    id: 4,
    title: "Pass Event",
    username: "",
    auctionTitle: "Description",
    timestamp: new Date("2025-08-29T16:30:00+07:00"),
  },
  {
    id: 5,
    title: "Auction Winner",
    username: "",
    auctionTitle: "Description",
    timestamp: new Date("2025-08-29T16:30:00+07:00"),
  },
  {
    id: 6,
    title: "Auction Winner",
    username: "",
    auctionTitle: "Description",
    timestamp: new Date("2025-08-29T16:30:00+07:00"),
  },
];

enum ScreenSize {
  Mobile = "mobile",
  Tablet = "tablet",
  Desktop = "desktop",
}

export default function NewsSection() {
  const [screenSize, setScreenSize] = useState<ScreenSize>(ScreenSize.Desktop);

  useEffect(() => {
    // Function to determine screen size
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize(ScreenSize.Mobile);
      } else if (window.innerWidth < 1024) {
        setScreenSize(ScreenSize.Tablet);
      } else {
        setScreenSize(ScreenSize.Desktop);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-xl bg-[#E8D5B0] p-4 sm:p-8 dark:bg-[#6a5c41]">
        <h2 className="mb-6 mt-0 text-center text-2xl font-bold sm:mb-8 sm:text-3xl dark:text-gray-100">
          News
        </h2>

        {/* Desktop: 2-column grid with horizontal layout */}
        {screenSize === ScreenSize.Desktop && (
          <div className="grid grid-cols-2 gap-4">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="flex overflow-hidden rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex w-36 flex-col justify-center bg-white p-2 text-center text-red-600 dark:bg-gray-800 dark:text-red-300">
                  <div className="text-xs font-medium">
                    {format(item.timestamp, "EEE, dd MMM yyyy")}
                  </div>
                  <div className="text-xs font-medium">
                    {format(item.timestamp, "HH:mm 'GMT+7'")}
                  </div>
                </div>
                <div className="flex-1 p-3">
                  <h3 className="mb-1 font-bold">{item.title}</h3>
                  {item.username && (
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {item.username}
                    </div>
                  )}
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.auctionTitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tablet: 1-column grid with horizontal layout */}
        {screenSize === ScreenSize.Tablet && (
          <div className="grid grid-cols-1 gap-4">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="flex overflow-hidden rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex w-36 flex-col justify-center bg-white p-2 text-center text-red-600 dark:bg-gray-800 dark:text-red-300">
                  <div className="text-xs font-medium">
                    {format(item.timestamp, "EEE, dd MMM yyyy")}
                  </div>
                  <div className="text-xs font-medium">
                    {format(item.timestamp, "HH:mm 'GMT+7'")}
                  </div>
                </div>
                <div className="flex-1 p-3">
                  <h3 className="mb-1 font-bold">{item.title}</h3>
                  {item.username && (
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {item.username}
                    </div>
                  )}
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {item.auctionTitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile: 1-column grid with vertical layout */}
        {screenSize === ScreenSize.Mobile && (
          <div className="grid grid-cols-1 gap-4">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-lg bg-white dark:bg-gray-800"
              >
                <div className="flex flex-col p-4">
                  <div className="mb-2 text-center text-red-600 dark:text-red-300">
                    <div className="text-xs font-medium">
                      {format(item.timestamp, "EEE, dd MMM yyyy")}
                    </div>
                    <div className="text-xs font-medium">
                      {format(item.timestamp, "HH:mm 'GMT+7'")}
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="mb-1 font-bold">{item.title}</h3>
                    {item.username && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {item.username}
                      </div>
                    )}
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {item.auctionTitle}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-center space-x-2 dark:text-gray-200">
          <Link href="#" className="px-2">
            1
          </Link>
          <Link href="#" className="px-2">
            2
          </Link>
          <Link href="#" className="px-2">
            3
          </Link>
          <Link href="#" className="px-2">
            4
          </Link>
          <Link href="#" className="px-2">
            »
          </Link>
        </div>
      </div>
    </div>
  );
}
