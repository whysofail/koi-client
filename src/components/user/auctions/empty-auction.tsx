import { Heart } from "lucide-react";

export function EmptyAuction() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
      <h3 className="mb-2 text-xl font-semibold">Your auction is empty</h3>
      <p className="text-muted-foreground">
        Participate in auctions to keep track of items you&apos;re interested
        in.
      </p>
    </div>
  );
}
