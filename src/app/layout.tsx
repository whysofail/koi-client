import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import SessionProvider from "@/lib/SessionProvider";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Koi Auction",
  description: "Koi Auction web client",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ReactQueryProvider>
            <main>{children}</main>
            <Toaster richColors position="top-right" />
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
