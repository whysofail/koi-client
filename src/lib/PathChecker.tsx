"use client";

import React, { FC } from "react";
import { usePathname } from "next/navigation";
import HomeHeader from "@/components/home/HomeHeader";
import Footer from "@/components/home/Footer";
import { Session } from "next-auth";

type PathCheckerProps = {
  children: React.ReactNode;
  session: Session | null;
};

const PathChecker: FC<PathCheckerProps> = ({ children, session }) => {
  const pathname = usePathname();
  const excludedPaths = ["/login", "/register"];
  const isExcluded = excludedPaths.includes(pathname);
  const isDashboard = pathname.startsWith("/dashboard");

  if (isExcluded) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
    );
  }

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <main className="flex min-h-screen flex-col">
      <HomeHeader session={session} />
      <div className="flex-grow">{children}</div>
      <Footer />
    </main>
  );
};

export default PathChecker;
