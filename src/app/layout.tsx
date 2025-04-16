import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import PathChecker from "@/lib/PathChecker";
import { SessionProvider } from "next-auth/react";
import { getServerSession } from "@/lib/serverSession";
import AuthRedirectProvider from "@/lib/AuthRedirectProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "FS Koi | %s",
    default: "FS Koi", // a default is required when creating a template
  },
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
          <ReactQueryProvider>
            <TooltipProvider>
              <SessionProvider session={session}>
                <AuthRedirectProvider>
                  <PathChecker session={session}>{children}</PathChecker>
                  <Toaster richColors position="bottom-right" />
                </AuthRedirectProvider>
              </SessionProvider>
            </TooltipProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
