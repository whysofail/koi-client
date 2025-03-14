"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../dashboard/ThemeToggle";
import { Session } from "next-auth";
import HeaderControl from "../dashboard/HeaderControl";
import type { User } from "next-auth";
import React, { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";

const HomeHeader: React.FC<{ session: Session | null }> = ({ session }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("body-with-menu-open");
    } else {
      document.body.classList.remove("body-with-menu-open");
    }

    return () => {
      document.body.classList.remove("body-with-menu-open");
    };
  }, [mobileMenuOpen]);

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };
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

      <header className="relative m-0 mx-auto ml-auto bg-white p-0 transition-all duration-300 dark:bg-gray-900">
        <div className="container mx-auto ml-auto flex items-center justify-between px-4">
          <button
            className="z-20 rounded-md p-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700 md:hidden"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 dark:text-gray-200" />
            ) : (
              <Menu className="h-6 w-6 dark:text-gray-200" />
            )}
          </button>

          <nav className="hidden items-center space-x-8 md:flex lg:space-x-12">
            <Link
              href="/auctions"
              className={classNames(
                "relative px-6 py-3 font-medium",
                currentPage === "auction"
                  ? "active-menu text-white"
                  : "text-gray-800 dark:text-gray-200",
              )}
            >
              AUCTIONS
            </Link>
            <Link
              href="/store"
              className={classNames(
                "relative px-6 py-3 font-medium lg:px-12",
                currentPage === "store"
                  ? "active-menu text-white"
                  : "text-gray-800 dark:text-gray-200",
              )}
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
              className={classNames(
                "block px-6 py-3 md:px-12",
                currentPage === "home"
                  ? "active-menu logo-menu text-white"
                  : "",
              )}
              aria-label="FS KOI Home"
            >
              <Image
                src={currentPage === "home" ? "/putih.png" : "/merah.png"}
                alt="FS KOI Logo"
                width={85}
                height={125}
                className="relative z-10 object-contain"
                style={{
                  maxHeight: "unset",
                  height: "auto",
                }}
                priority
              />
            </Link>
          </div>

          <div className="hidden items-center space-x-4 md:flex lg:space-x-6">
            <Link
              href="/contact"
              className={classNames(
                "relative px-6 py-3 font-medium lg:px-12",
                currentPage === "contact"
                  ? "active-menu text-white"
                  : "text-gray-800 dark:text-gray-200",
              )}
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
          <div className="flex items-center space-x-2 md:hidden">
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
            {mobileMenuOpen && (
              <div
                className="mobile-menu-overlay fixed inset-0 z-30 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 md:hidden"
                onClick={closeMobileMenu}
              />
            )}
            <div
              className={classNames(
                "fixed left-0 top-0 z-40 h-screen w-3/4 max-w-xs transform bg-white transition-transform duration-300 ease-in-out dark:bg-gray-800 md:hidden",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
              )}
            >
              {/* Close button inside mobile menu */}
              <button
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6 dark:text-gray-200" />
              </button>
              <div className="flex h-full flex-col px-4 pb-6 pt-16">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/auction"
                    className={classNames(
                      "rounded-md px-4 py-2 font-medium transition-colors",
                      currentPage === "auction"
                        ? "active-menu text-center text-white"
                        : "text-center text-gray-800 hover:bg-red-800 hover:text-white active:bg-red-800 active:text-white dark:text-gray-200 dark:hover:bg-red-700",
                    )}
                    onClick={closeMobileMenu}
                  >
                    AUCTION
                  </Link>
                  <Link
                    href="/store"
                    className={classNames(
                      "rounded-md px-4 py-2 font-medium transition-colors",
                      currentPage === "store"
                        ? "active-menu text-center text-white"
                        : "text-center text-gray-800 hover:bg-red-800 hover:text-white active:bg-red-800 active:text-white dark:text-gray-200 dark:hover:bg-red-700",
                    )}
                    onClick={closeMobileMenu}
                  >
                    OUR STORE
                  </Link>
                  <Link
                    href="/contact"
                    className={classNames(
                      "rounded-md px-4 py-2 font-medium transition-colors",
                      currentPage === "contact"
                        ? "active-menu text-center text-white"
                        : "text-center text-gray-800 hover:bg-red-800 hover:text-white active:bg-red-800 active:text-white dark:text-gray-200 dark:hover:bg-red-700",
                    )}
                    onClick={closeMobileMenu}
                  >
                    CONTACT US
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HomeHeader;
