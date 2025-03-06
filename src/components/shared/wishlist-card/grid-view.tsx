import type { Wishlist } from "@/types/wishlistTypes";
import { WishlistItemGrid } from "./wishlist-item-grid";
interface GridViewProps {
  wishlists: Wishlist[];
  onRemoveFromWishlist?: (wishlistId: string) => void;
}

export function GridView({ wishlists, onRemoveFromWishlist }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {wishlists.map((wishlist) => (
        <WishlistItemGrid
          key={wishlist.wishlist_id}
          wishlist={wishlist}
          onRemoveFromWishlist={onRemoveFromWishlist}
        />
      ))}
    </div>
  );
}
