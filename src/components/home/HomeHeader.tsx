"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import ThemeToggle from "../dashboard/ThemeToggle";

const HomeHeader = () => {
  const pathname = usePathname();

  return (
    <div className="relative">
      <div className="mb-0 h-6 w-full bg-red-800 outline outline-blue-500 dark:bg-red-900 dark:outline-blue-600" />

      <header className="relative m-0 bg-white p-0 dark:bg-gray-900">
        <div className="container mx-auto flex items-center justify-between px-4">
          <nav className="flex items-center space-x-4">
            <Link
              href="/auctions"
              className={`relative px-6 py-3 font-medium ${
                pathname === "/auctions"
                  ? "active-menu text-black dark:text-white"
                  : "text-gray-800 dark:text-gray-300"
              }`}
            >
              AUCTION
            </Link>
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/Logo.png"
              alt="FS KOI Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/contact"
              className="font-medium text-gray-800 dark:text-gray-300"
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
