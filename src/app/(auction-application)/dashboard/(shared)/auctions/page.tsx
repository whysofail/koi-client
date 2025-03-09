import React from "react";
import { getServerSession } from "@/lib/serverSession";
import AuctionsTable from "@/components/admin/auctions-table/AuctionsTable";
import AuctionList from "@/components/user/auctions/AuctionList";

const AuctionsPage = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";
  const userId = session?.user.id ?? "";
  const role = session?.user.role ?? "";
  const isAdmin = role === "admin";

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            {isAdmin ? "Auctions" : "My Auctions"}
          </h2>
          <p className="pl-5 pr-5 text-sm text-gray-500">
            {isAdmin
              ? "Manage all auctions and bids."
              : "Track your bids and auction participation"}
          </p>
        </div>
      </div>
      <div className="mt-8 pb-8 pl-5 pr-5">
        {isAdmin ? (
          <AuctionsTable token={token} />
        ) : (
          <AuctionList token={token} currentUserId={userId} />
        )}
      </div>
    </>
  );
};

export default AuctionsPage;
