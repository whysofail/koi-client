"use client";

import { useState } from "react";
import type { Wishlist } from "@/types/wishlistTypes";
import { EmptyWishlist } from "./empty-wishlist";
import { ViewToggle } from "./view-toggle";
import { GridView } from "./grid-view";
import { ListView } from "./list-view";
import { User } from "next-auth";
import WishlistCardViewModel from "./wishlist-card.viewModel";

interface WishlistCardProps {
  user: User;
  onRemoveFromWishlist?: (wishlistId: string) => void;
}

export function WishlistCard({
  user,
  onRemoveFromWishlist,
}: WishlistCardProps) {
  const { wishlistData, isLoading } = WishlistCardViewModel({ user });
  const wishlists = wishlistData?.data ?? [];
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (wishlists.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">My Wishlist</h2>
          <p className="text-sm text-gray-500">Your saved auctions.</p>
        </div>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === "grid" ? (
        <GridView
          wishlists={wishlists}
          onRemoveFromWishlist={onRemoveFromWishlist}
        />
      ) : (
        <ListView
          wishlists={wishlists}
          onRemoveFromWishlist={onRemoveFromWishlist}
        />
      )}
    </div>
  );
}
