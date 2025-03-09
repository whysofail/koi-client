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
import { User } from "next-auth";
import Header from "@/components/dashboard/Header";

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
              <SidebarNav isAdmin={isAdmin} />
              <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b px-6  dark:border-neutral-700">
                  <SidebarTrigger />
                  <div className="ml-auto">
                    <Header user={session?.user as User} />
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
