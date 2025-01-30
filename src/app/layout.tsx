import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/lib/ReactQueryProvider";
import { ThemeProvider } from "next-themes";
import PathChecker from "@/lib/PathChecker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Koi Auction",
  description: "Koi Auction web client",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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
            <PathChecker
              nonDashboardContent={
                <>
                  <h1>
                    This reusable comps will only be rendered on the non-app
                    pages (e.g landing page), not in the app pages
                  </h1>
                  <h1>
                    Use this for reusable components in the landing pages or any
                    non-application pages/routes
                  </h1>
                </>
              }
            >
              {children}
            </PathChecker>
            <Toaster richColors position="top-right" />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
