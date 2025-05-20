"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
// import ThemeToggle from "../dashboard/ThemeToggle";
import type { Session } from "next-auth";
import HeaderControl from "../dashboard/HeaderControl";
import type { User } from "next-auth";
import type React from "react";
import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";

const HomeHeader: React.FC<{ session: Session | null }> = ({ session }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBg, setShowBg] = useState(mobileMenuOpen);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("body-with-menu-open");
      setShowBg(true);
    } else {
      document.body.classList.remove("body-with-menu-open");
      const timeout = setTimeout(() => setShowBg(false), 300);
      return () => clearTimeout(timeout);
    }

    // Close mobile menu when screen size changes to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    // Handle scroll events for sticky header
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.classList.remove("body-with-menu-open");
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mobileMenuOpen]);

  const laravelURI = process.env.NEXT_PUBLIC_LARAVEL_URL;

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

      <header
        className={classNames(
          "sticky top-0 z-50 m-0 mx-auto ml-auto bg-white p-0 transition-all duration-300 dark:bg-gray-900",
          scrolled ? "shadow-md" : "",
        )}
      >
        <div className="container mx-auto ml-auto flex items-center justify-between px-2 py-2 sm:px-4 md:py-0">
          <button
            className="z-20 rounded-md p-2 hover:bg-gray-100 focus:outline-none md:hidden dark:hover:bg-gray-700"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6 dark:text-gray-200" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6 dark:text-gray-200" />
            )}
          </button>

          <nav className="hidden items-center space-x-2 md:flex md:space-x-4 lg:space-x-6 xl:space-x-8">
            <Link
              href="/auctions"
              className={classNames(
                "relative px-2 py-3 text-sm font-medium md:px-3 lg:px-4 xl:px-6 xl:text-base",
                currentPage === "auction"
                  ? "active-menu text-white"
                  : "text-gray-800 hover:text-red-800 dark:text-gray-200 dark:hover:text-red-400",
              )}
            >
              AUCTIONS
            </Link>
            <a
              href={laravelURI}
              target="_blank"
              rel="noopener noreferrer"
              className={classNames(
                "relative px-2 py-3 text-sm font-medium md:px-3 lg:px-4 xl:px-6 xl:text-base",
                currentPage === "store"
                  ? "active-menu text-white"
                  : "text-gray-800 hover:text-red-800 dark:text-gray-200 dark:hover:text-red-400",
              )}
            >
              OUR STORE
            </a>
          </nav>

          <div
            className="absolute left-1/2 z-10 -translate-x-1/2 transition-all duration-300"
            style={{ top: "0px" }}
          >
            <Link
              href="/"
              className={classNames(
                "block px-2 py-1 sm:px-4 sm:py-2 md:px-8 lg:px-12",
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
                className="relative z-10 h-auto w-[60px] object-contain sm:w-[70px] md:w-[85px]"
                style={{
                  maxHeight: "unset",
                }}
                priority
              />
            </Link>
          </div>

          <div className="hidden items-center space-x-2 md:flex md:space-x-4 lg:space-x-6">
            <Link
              href="/contact"
              className={classNames(
                "relative px-2 py-3 text-sm font-medium md:px-3 lg:px-4 xl:px-6 xl:text-base",
                currentPage === "contact"
                  ? "active-menu text-white"
                  : "text-gray-800 hover:text-red-800 dark:text-gray-200 dark:hover:text-red-400",
              )}
            >
              CONTACT US
            </Link>
            {session ? (
              <HeaderControl user={session?.user as User} />
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  asChild
                  variant="default"
                  // className="rounded-md bg-black px-2 py-1 text-xs text-white sm:px-3 sm:text-sm dark:bg-white dark:text-black"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                {/* <ThemeToggle /> */}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 md:hidden">
            {session ? (
              <HeaderControl user={session?.user as User} />
            ) : (
              <div className="flex items-center space-x-1">
                <Button
                  asChild
                  variant="default"
                  // className="rounded-md bg-black px-2 py-1 text-xs text-white sm:px-3 sm:text-sm dark:bg-white dark:text-black"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                {/* <ThemeToggle /> */}
              </div>
            )}

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
              <div
                className="mobile-menu-overlay fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden dark:bg-black dark:bg-opacity-70"
                onClick={closeMobileMenu}
              />
            )}

            {/* Mobile Menu Drawer */}
            <div
              className={classNames(
                "fixed left-0 top-0 z-40 h-screen w-4/5 max-w-xs transform overflow-y-auto transition-transform duration-300 ease-in-out md:hidden",
                mobileMenuOpen
                  ? "translate-x-0 shadow-lg"
                  : "-translate-x-full",
                showBg ? "bg-white dark:bg-gray-900" : "bg-none",
              )}
            >
              <button
                className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-700"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 dark:text-gray-200" />
              </button>

              <div className="flex h-full flex-col px-4 pb-6 pt-16">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/auctions"
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
                  <a
                    href={laravelURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames(
                      "rounded-md px-4 py-2 font-medium transition-colors",
                      currentPage === "store"
                        ? "active-menu text-center text-white"
                        : "text-center text-gray-800 hover:bg-red-800 hover:text-white active:bg-red-800 active:text-white dark:text-gray-200 dark:hover:bg-red-700",
                    )}
                    onClick={closeMobileMenu}
                  >
                    OUR STORE
                  </a>
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
