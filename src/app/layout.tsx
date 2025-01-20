import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import SessionProvider from "@/lib/SessionProvider";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { auth } from "@/auth";
import PathChecker from "@/lib/PathChecker";
import AuthRedirectProvider from "@/lib/AuthRedirectProvider";

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
          <AuthRedirectProvider>
            <ReactQueryProvider>
              <PathChecker>
                {children}
                <Toaster richColors position="top-right" />
              </PathChecker>
            </ReactQueryProvider>
          </AuthRedirectProvider>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
