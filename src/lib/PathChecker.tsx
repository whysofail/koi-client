"use client";

import React from "react";
import { usePathname } from "next/navigation";

type PathCheckerProps = {
  children: React.ReactNode;
  nonDashboardContent?: React.ReactNode;
};

const PathChecker: React.FC<PathCheckerProps> = ({
  children,
  nonDashboardContent,
}) => {
  const pathname = usePathname();
  const excludedPaths = ["/login", "/register", "/403", "/session-expired"];
  const isExcluded = excludedPaths.includes(pathname);
  const isDashboard = pathname.startsWith("/dashboard");

  if (isExcluded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {!isDashboard && nonDashboardContent}
      {children}
    </main>
  );
};

export default PathChecker;
