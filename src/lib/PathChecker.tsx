"use client";

import React from "react";
import { usePathname } from "next/navigation";
import HomeHeader from "@/components/home/HomeHeader";
import Footer from "@/components/home/Footer";

type PathCheckerProps = {
  children: React.ReactNode;
};

const PathChecker: React.FC<PathCheckerProps> = ({ children }) => {
  const pathname = usePathname();
  const excludedPaths = [
    "/login",
    "/register",
    "/403",
    "/session-expired",
    "/404",
  ];
  const isExcluded = excludedPaths.includes(pathname);
  const isDashboard = pathname.startsWith("/dashboard");

  if (isExcluded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
    );
  }

  if (!isDashboard) {
    return (
      <main className="min-h-screen">
        <HomeHeader />
        {children}
        <Footer />
      </main>
    );
  }

  return <main className="min-h-screen">{children}</main>;
};

export default PathChecker;
