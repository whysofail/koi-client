import React, { FC } from "react";
import { getServerSession } from "@/lib/serverSession";
import AuctionsTable from "@/components/admin/auctions-table/AuctionsTable";

const AuctionsPage: FC = async () => {
  const session = await getServerSession();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="pl-5 pr-5 pt-5 text-3xl font-bold tracking-tight">
            Auctions
          </h2>
        </div>
      </div>
      <div className="mt-8 pl-5 pr-5">
        <AuctionsTable token={session?.user?.accessToken ?? ""} />
      </div>
    </>
  );
};

export default AuctionsPage;
