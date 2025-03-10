"use client";

import { useState } from "react";
import BidModal from "./bid-modal";

interface BidButtonProps {
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

export default function BidButton({ item }: BidButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex-1 rounded-md bg-red-800 px-4 py-2 text-white transition-colors hover:bg-red-700"
      >
        BID
      </button>

      <BidModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
      />
    </>
  );
}
