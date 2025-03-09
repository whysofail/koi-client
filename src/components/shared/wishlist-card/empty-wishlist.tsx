import { Heart } from "lucide-react";

export function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
      <h3 className="mb-2 text-xl font-semibold">Your wishlist is empty</h3>
      <p className="text-muted-foreground">
        Add items to your wishlist to keep track of auctions you&apos;re
        interested in.
      </p>
    </div>
  );
}
