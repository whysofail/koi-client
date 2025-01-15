import React from "react";
import Header from "@/components/dashboard/Header";
import StatsCards from "@/components/dashboard/StatsCards";
import ActiveAuctionsTable from "@/components/dashboard/ActiveAuctionsTable";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import FeaturedAuctions from "@/components/dashboard/FeaturedAuctions";
import { getServerSession } from "@/lib/ServerSession";

const Home = async () => {
  const session = await getServerSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarNav />
        <SidebarInset className="flex w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b px-6">
            <SidebarTrigger />
            <div className="ml-auto">
              <Header />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
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
                      <ActiveAuctionsTable isAdmin={isAdmin} />
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div>
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold">
                        Featured Auctions
                      </h2>
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
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Home;
