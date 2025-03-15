"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const AuthRedirectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();

  // Keep using the existing useAuthRedirect hook for API errors
  useAuthRedirect();

  // Add NextAuth-specific token expiration checks
  useEffect(() => {
    if (session?.error === "TokenExpired") {
      signOut({ callbackUrl: "/session-expired" });
    }
  }, [session]);

  // Check token expiration manually
  useEffect(() => {
    if (session?.user?.accessTokenExpires) {
      const checkExpiration = () => {
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > (session.user.accessTokenExpires as number)) {
          signOut({ callbackUrl: "/session-expired" });
        }
      };

      // Check immediately
      checkExpiration();

      // Then check periodically
      const interval = setInterval(checkExpiration, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [session]);

  return <>{children}</>;
};

export default AuthRedirectProvider;
