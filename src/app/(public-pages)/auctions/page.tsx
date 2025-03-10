import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BidButton from "@/components/home/bid-button";

export default function AuctionPage() {
  // Dummy data for auction items
  const auctionItems = [
    { id: 1, bids: 30, price: "8.500.000", time: "0:05:00" },
    { id: 2, bids: 15, price: "6.000.000", time: "0:05:00" },
    { id: 3, bids: 30, price: "8.500.000", time: "0:05:00" },
    { id: 4, bids: 30, price: "8.500.000", time: "0:05:00" },
    { id: 5, bids: 30, price: "8.500.000", time: "0:05:00" },
    { id: 6, bids: 15, price: "6.000.000", time: "0:05:00" },
    { id: 7, bids: 30, price: "8.500.000", time: "0:05:00" },
    { id: 8, bids: 30, price: "8.500.000", time: "0:05:00" },
  ];

  // Dummy data for history items
  const historyItems = [
    { id: 1, status: "Win" },
    { id: 2, status: "Win" },
    { id: 3, status: "Lose" },
    { id: 4, status: "Win" },
    { id: 5, status: "Lose" },
    { id: 6, status: "On Progress" },
  ];

  return (
    <div className="flex min-h-screen flex-col dark:bg-gray-900">
      <main className="container mx-auto flex-grow px-4 py-8">
        {/* Auction Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {auctionItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-[#E8D5B0] p-4 dark:bg-[#6a5c41] dark:text-gray-100"
            >
              <h3 className="mb-2 text-lg font-medium">Lorem Ipsum</h3>
              <div className="relative mb-2 aspect-square">
                <Image
                  src="/placeholder.svg?height=400&width=400"
                  alt="Koi fish"
                  width={400}
                  height={400}
                  className="rounded-lg bg-blue-500"
                />
              </div>
              <div className="mb-2 flex justify-between text-sm">
                <span>{item.bids} Bids</span>
                <span>{item.time}</span>
              </div>
              <div className="mb-3 font-bold">Rp. {item.price}</div>
              <div className="flex gap-2">
                <BidButton
                  item={{
                    title: "Lorem Ipsum",
                    gender: "Male",
                    size: "53cm",
                    age: "2 year",
                    image: "/placeholder.svg?height=400&width=400",
                    bidCount: item.bids,
                    timeLeft: item.time,
                    currentPrice: Number.parseInt(
                      item.price.replace(/\D/g, ""),
                    ),
                    biddingPrice: Number.parseInt(
                      item.price.replace(/\D/g, ""),
                    ),
                    highestBidderId: "IcDF2004",
                  }}
                />
                <button className="flex w-10 items-center justify-center rounded-md bg-gray-400 text-white transition-colors hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Next Button */}
        <div className="mt-6 flex justify-end">
          <Link
            href="#"
            className="rounded-full bg-[#E8D5B0] px-6 py-2 text-red-800 transition-colors hover:bg-[#d8c5a0] dark:bg-[#6a5c41] dark:text-red-300 dark:hover:bg-[#7a6c51]"
          >
            Next {">"}
          </Link>
        </div>

        {/* History Section */}
        <div className="mt-12 rounded-lg bg-gray-200 p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-bold dark:text-white">
            History Auction
          </h2>
          <div className="relative">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-1 shadow-md dark:bg-gray-700 dark:text-gray-200">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-4 overflow-x-auto px-8 py-2">
              {historyItems.map((item) => (
                <div key={item.id} className="flex-shrink-0">
                  <div className="relative mb-2 h-24 w-24">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Koi fish history"
                      width={200}
                      height={200}
                      className="rounded-lg bg-blue-500"
                    />
                  </div>
                  <div className="text-center text-sm dark:text-gray-300">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-1 shadow-md dark:bg-gray-700 dark:text-gray-200">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
