import React, { FC } from "react";
import { getServerSession } from "@/lib/serverSession";
import AuthRedirectProvider from "@/lib/AuthRedirectProvider";
import { SessionProvider } from "next-auth/react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { User } from "next-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const DashboardLayout: FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  const session = await getServerSession();
  const isAdmin = session?.user?.role === "admin";

  return (
    <SessionProvider session={session}>
      <AuthRedirectProvider>
        <SidebarProvider>
          <TooltipProvider>
            <div className="flex min-h-screen w-full">
              {/* Pass isAdmin from session to SidebarNav */}
              <SidebarNav isAdmin={isAdmin} />
              <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b px-6 dark:border-neutral-700">
                  <SidebarTrigger />
                  {/* Go to home */}
                  <Link href="/">
                    <Button>
                      <Home />
                      Home
                    </Button>
                  </Link>
                  {/* Pass user to DashboardHeader */}
                  <div className="ml-auto">
                    {/* Pass initial user from server session */}
                    <DashboardHeader user={session?.user as User} />
                  </div>
                </header>
                <main className="flex-1 overflow-auto">{children}</main>
              </SidebarInset>
            </div>
          </TooltipProvider>
        </SidebarProvider>
      </AuthRedirectProvider>
    </SessionProvider>
  );
};

export default DashboardLayout;
