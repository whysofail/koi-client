"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    gender: string;
    size: string;
    age: string;
    image: string;
    bidCount: number;
    timeLeft: string;
    currentPrice: number;
    biddingPrice: number;
    highestBidderId: string;
  };
}

export default function BidModal({ isOpen, onClose, item }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState(item.biddingPrice);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const adjustBid = (amount: number) => {
    setBidAmount((prev) => prev + amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative mx-auto w-full max-w-lg rounded-lg bg-[#E8D5B0] p-4 sm:p-6">
        {/* Close Button - Moved to top right */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 p-1 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title Section */}
        <div className="mb-4 pr-8">
          <h2 className="text-xl font-bold sm:text-2xl">{item.title}</h2>
          <p className="text-sm text-gray-700 sm:text-base">
            {item.gender} / {item.size} / {item.age}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {/* Image Section */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-blue-500">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span>Bid count</span>
              <span>{item.bidCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Time left</span>
              <span className="text-red-600">{item.timeLeft}</span>
            </div>
            <div className="flex justify-between">
              <span>Now price</span>
              <span>{formatPrice(item.currentPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Bidding price</span>
              <div className="flex items-center">
                <span>{formatPrice(item.biddingPrice)}</span>
                <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-red-600 sm:text-sm">
                  Win
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Highest bidder ID</span>
              <span>{item.highestBidderId}</span>
            </div>
          </div>
        </div>

        {/* Bidding Section */}
        <div className="mt-6">
          <div className="rounded-lg bg-red-800 p-3 text-white sm:p-4">
            <h3 className="mb-2 text-base sm:mb-3 sm:text-lg">Bidding Price</h3>
            <div className="flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={formatPrice(bidAmount)}
                  onChange={(e) =>
                    setBidAmount(Number(e.target.value.replace(/\D/g, "")))
                  }
                  className="w-full rounded-lg px-3 py-2 text-lg text-black sm:px-4 sm:text-xl"
                />
                <div className="absolute bottom-0 right-2 top-0 flex flex-col justify-center">
                  <button
                    onClick={() => adjustBid(100000)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => adjustBid(-100000)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Button */}
        <button className="mt-6 w-full rounded-full bg-yellow-300 py-2 text-lg font-bold text-red-800 shadow-lg transition-colors hover:bg-yellow-400 sm:py-3 sm:text-xl">
          BID
        </button>

        {/* Footer with X CLOSE text - Moved below with proper spacing */}
        <div className="mb-2 mt-8 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            X CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
