import React, { FC } from "react";
import { getServerSession } from "@/lib/serverSession";
import AuctionsTable from "@/components/admin/auctions-table/AuctionsTable";

const AuctionsPage: FC = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";
  const role = session?.user.role ?? "";

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            {role === "admin" ? "Auctions" : "My Auctions"}
          </h2>
          {role === "admin" ? (
            <p className="pl-5 pr-5 text-sm text-gray-500">
              Manage all auctions and bids.
            </p>
          ) : (
            <p className="pl-5 pr-5 text-sm text-gray-500">
              Track your bids and auction participation
            </p>
          )}
        </div>
      </div>
      <div className="mt-8 pl-5 pr-5">
        <AuctionsTable token={token} />
      </div>
    </>
  );
};

export default AuctionsPage;
