"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../dashboard/ThemeToggle";
import { useSession } from "next-auth/react";
import HeaderControl from "../dashboard/HeaderControl";
import type { User } from "next-auth";
import type React from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

const HomeHeader: React.FC<{
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ sidebarOpen, setSidebarOpen }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentPage =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/auctions")
        ? "auction"
        : pathname.startsWith("/store")
          ? "store"
          : pathname.startsWith("/contact")
            ? "contact"
            : "";

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div className="h-6 w-full bg-red-800" />

      <header className="relative m-0 mx-auto ml-auto bg-white p-0 transition-all duration-300 dark:bg-gray-900">
        <div className="container mx-auto ml-auto flex items-center justify-between px-4">
          <nav className="flex items-center space-x-12">
            {/* Show sidebar toggle button only when user is logged in */}
            {session && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="ml-auto mr-2"
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                {sidebarOpen ? (
                  <PanelRightClose className="h-5 w-5" />
                ) : (
                  <PanelRightOpen className="h-5 w-5" />
                )}
              </Button>
            )}
            <Link
              href="/auctions"
              className={`relative px-6 py-3 font-medium ${
                currentPage === "auction"
                  ? "active-menu text-white dark:text-white"
                  : "text-gray-800 dark:text-gray-300"
              }`}
            >
              AUCTION
            </Link>
            <Link
              href="/store"
              className={`relative px-12 py-3 font-medium ${
                currentPage === "store"
                  ? "active-menu text-white dark:text-white"
                  : "text-gray-800 dark:text-gray-300"
              }`}
            >
              OUR STORE
            </Link>
          </nav>

          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 transition-all duration-300"
            style={{ top: "0px" }}
          >
            <Link
              href="/"
              className={`block px-12 py-3 ${currentPage === "home" ? "active-menu logo-menu" : ""}`}
            >
              <Image
                src={currentPage === "home" ? "/putih.png" : "/Logo.png"}
                alt="FS KOI Logo"
                width={85}
                height={currentPage === "home" ? 125 : 80}
                className="relative z-10 object-contain"
                style={{
                  maxHeight: "unset",
                  height: "auto",
                }}
              />
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/contact"
              className={`relative px-6 py-3 font-medium ${
                currentPage === "contact"
                  ? "active-menu text-white dark:text-white"
                  : "text-gray-800 dark:text-gray-300"
              }`}
            >
              CONTACT US
            </Link>
            {session ? (
              <HeaderControl user={session?.user as User} />
            ) : (
              <>
                <Button
                  asChild
                  className="rounded-md bg-black px-3 py-1 text-sm text-white dark:bg-white dark:text-black"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <ThemeToggle />
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomeHeader;
