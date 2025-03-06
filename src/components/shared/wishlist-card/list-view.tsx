import type { Wishlist } from "@/types/wishlistTypes";
import { WishlistItemList } from "./wishlist-item-list";
interface ListViewProps {
  wishlists: Wishlist[];
  onRemoveFromWishlist?: (wishlistId: string) => void;
}

export function ListView({ wishlists, onRemoveFromWishlist }: ListViewProps) {
  return (
    <div className="space-y-4">
      {wishlists.map((wishlist) => (
        <WishlistItemList
          key={wishlist.wishlist_id}
          wishlist={wishlist}
          onRemoveFromWishlist={onRemoveFromWishlist}
        />
      ))}
    </div>
  );
}
