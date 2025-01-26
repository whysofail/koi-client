"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SidebarNav from "@/components/dashboard/sidebar-nav";
import Header from "@/components/dashboard/Header";
import { useSession } from "next-auth/react";

type PathCheckerProps = {
  children: React.ReactNode;
};

const PathChecker: React.FC<PathCheckerProps> = ({ children }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const excludedPaths = ["/login", "/register", "/403", "/session-expired"];
  const isExcluded = excludedPaths.includes(pathname);
  const isAdmin = session?.user?.role === "admin";

  if (isExcluded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <SidebarNav isAdmin={isAdmin} />
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b px-6  dark:border-neutral-700">
            <SidebarTrigger />
            <div className="ml-auto">
              <Header />
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default PathChecker;
