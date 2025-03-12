"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import ThemeToggle from "../dashboard/ThemeToggle";

const HomeHeader = () => {
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

  return (
    <div className="relative">
      <div className="h-6 w-full bg-red-800" />

      <header className="relative m-0 bg-white p-0 dark:bg-gray-900">
        <div className="container mx-auto flex items-center justify-between px-4">
          <nav className="flex items-center space-x-12">
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

          {/* Logo container with active-menu polygon when on home page */}
          <div
            className="absolute left-1/2 z-10 -translate-x-1/2"
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
            <Button
              asChild
              className="rounded-md bg-black px-3 py-1 text-sm text-white dark:bg-white dark:text-black"
            >
              <Link href="/login">Log In</Link>
            </Button>
            <ThemeToggle />
            <button className="text-gray-800 dark:text-gray-300">
              <ShoppingCart className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomeHeader;
