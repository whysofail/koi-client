import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import authOptions from "@/server/authOptions";
import SessionProvider from "@/lib/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Koi Auction",
  description: "Koi Auction web client",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const serverSession = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={serverSession}>
          <main>{children}</main>
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
