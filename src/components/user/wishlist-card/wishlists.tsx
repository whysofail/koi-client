"use client";

import { useState } from "react";
import { EmptyWishlist } from "./empty-wishlist";
import { ViewToggle } from "../toggle/view-toggle";
import { GridView } from "./grid-view";
import { ListView } from "./list-view";
import { User } from "next-auth";
import WishlistCardViewModel from "./wishlist-card.viewModel";
import { WishlistItemGridSkeleton } from "@/components/skeletons/wishlist-card-skeleton";

interface WishlistCardProps {
  user: User;
}

export function WishlistCard({ user }: WishlistCardProps) {
  const { wishlistData, isLoading, handleRemoveFromWishlist } =
    WishlistCardViewModel({ user });
  const wishlists = wishlistData?.data ?? [];
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="container mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">My Wishlist</h2>
          <p className="text-sm text-gray-500">Your saved auctions.</p>
        </div>

        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <WishlistItemGridSkeleton key={index} />
          ))}
        </div>
      ) : null}
      {!isLoading && wishlists.length === 0 && <EmptyWishlist />}
      {viewMode === "grid" ? (
        <GridView
          wishlists={wishlists}
          onRemoveFromWishlist={handleRemoveFromWishlist}
        />
      ) : (
        <ListView
          wishlists={wishlists}
          onRemoveFromWishlist={handleRemoveFromWishlist}
        />
      )}
    </div>
  );
}
