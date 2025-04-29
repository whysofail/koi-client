import React, { FC } from "react";
import { getServerSession } from "@/lib/serverSession";
import BidsTable from "@/components/shared/bids-table/BidsTable";

export const metadata = {
  title: "Bids",
  description: "View and manage your bids",
};

const BidsPage: FC = async () => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";
  const role = session?.user.role ?? "";
  const isAdmin = role === "admin";

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            {isAdmin ? "All Bids" : "My Bids"}
          </h2>
          <p className="pl-5 pr-5 text-sm text-gray-500">
            {isAdmin
              ? "Monitor and manage all user bids across auctions."
              : "Track your bidding history and auction participation."}
          </p>
        </div>
      </div>
      <div className="mt-8 pl-5 pr-5">
        <BidsTable token={token} isAdmin={isAdmin} />
      </div>
    </>
  );
};

export default BidsPage;
