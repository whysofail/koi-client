import React from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import ActiveAuctionsTable from "@/components/dashboard/ActiveAuctionsTable";
import FeaturedAuctions from "@/components/dashboard/FeaturedAuctions";
import { getServerSession } from "@/lib/serverSession";

const Home = async () => {
  const session = await getServerSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <main className="container mx-auto p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isAdmin ? "Admin Dashboard" : "Dashboard"}
        </h1>
      </div>
      <div className="mt-6">
        <StatsCards isAdmin={isAdmin} />
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Active Auctions</h2>
              <p className="text-muted-foreground text-sm">
                Monitor and manage ongoing auctions
              </p>
            </div>
            <div className="rounded-lg border">
              <ActiveAuctionsTable />
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Featured Auctions</h2>
              <p className="text-muted-foreground text-sm">
                Premium and highlighted listings
              </p>
            </div>
            <div className="rounded-lg border">
              <FeaturedAuctions isAdmin={isAdmin} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
