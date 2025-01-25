import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import SessionProvider from "@/lib/SessionProvider";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import PathChecker from "@/lib/PathChecker";
import AuthRedirectProvider from "@/lib/AuthRedirectProvider";
import { ThemeProvider } from "next-themes";
import { getServerSession } from "@/lib/serverSession";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Koi Auction",
  description: "Koi Auction web client",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
