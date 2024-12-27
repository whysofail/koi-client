import React from "react";
import Header from "@/components/dashboard/Header";
import AuctionStatsCards from "@/components/user-dashboard/AuctionStatsCards";
import ActiveAuctionsTable from "@/components/user-dashboard/ActiveAuctionsTable";
import Watchlist from "@/components/user-dashboard/Watchlist";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {session?.user?.role === "admin" ? "Admin Dashboard" : "Dashboard"}
          </h2>
        </div>
        <div className="space-y-4">
          <AuctionStatsCards />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <div className="bg-card rounded-xl border">
                <div className="p-6">
                  <h3 className="text-xl font-semibold">Active Auctions</h3>
                  <p className="text-muted-foreground text-sm">
                    Your current bids and watched items
                  </p>
                </div>
                <ActiveAuctionsTable />
              </div>
            </div>
            <div className="col-span-3">
              <div className="bg-card rounded-xl border">
                <div className="p-6">
                  <h3 className="text-xl font-semibold">Watchlist</h3>
                  <p className="text-muted-foreground text-sm">
                    Items you&apos;re interested in
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <Watchlist />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
