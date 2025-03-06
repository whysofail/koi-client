import React from "react";
import { getServerSession } from "@/lib/serverSession";

import { WishlistCard } from "@/components/shared/wishlist-card/wishlists";

const WishlistPage = async () => {
  const session = await getServerSession();

  return (
    <>
      <div className="flex items-center justify-between space-y-2"></div>
      <div className="mt-8 pl-5 pr-5">
        {session?.user && <WishlistCard user={session.user} />}
      </div>
    </>
  );
};

export default WishlistPage;
