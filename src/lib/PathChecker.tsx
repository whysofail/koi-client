"use client";

import React, { FC, useState } from "react";
import { usePathname } from "next/navigation";
import HomeHeader from "@/components/home/HomeHeader";
import Footer from "@/components/home/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import SidebarNav from "@/components/dashboard/sidebar-nav";

type PathCheckerProps = {
  children: React.ReactNode;
};

const PathChecker: FC<PathCheckerProps> = ({ children }) => {
  const pathname = usePathname();
  const excludedPaths = ["/login", "/register"];
  const isExcluded = excludedPaths.includes(pathname);
  const session = useSession();
  const isAdmin = session?.data?.user?.role === "admin";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isExcluded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <HomeHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SidebarNav isAdmin={isAdmin} />
        <div className="flex-grow">{children}</div>
      </SidebarProvider>
      <Footer />
    </main>
  );
};

export default PathChecker;
