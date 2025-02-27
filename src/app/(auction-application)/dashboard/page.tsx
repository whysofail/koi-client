import React from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import ActiveAuctionsTable from "@/components/dashboard/ActiveAuctionsTable/ActiveAuctionsTable";
import { getServerSession } from "@/lib/serverSession";
import LatestAuctions from "@/components/dashboard/LatestAuctions/LatestAuctions";

const Home = async () => {
  const session = await getServerSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="container mx-auto p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {isAdmin ? "Admin Dashboard" : "Dashboard"}
        </h1>
      </div>
      <div className="mt-6">
        {isAdmin && (
          //TODO: ask if user could have something like this but with different stats
          <StatsCards
            isAdmin={isAdmin}
            token={session?.user?.accessToken ?? ""}
          />
        )}
      </div>
      <div className="mt-6">
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              {isAdmin ? "Active Auction" : "Latest Auctions"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isAdmin
                ? "Monitor and manage ongoing auctions"
                : "Check out the latest auctions"}
            </p>
          </div>
          {/* TODO: SUBJECT TO CHANGE */}
          {isAdmin ? (
            <div className="rounded-lg border">
              <ActiveAuctionsTable token={session?.user?.accessToken ?? ""} />
            </div>
          ) : (
            <LatestAuctions />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
