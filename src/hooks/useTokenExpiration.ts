// hooks/useTokenExpiration.ts
"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useTokenExpiration() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error === "TokenExpired") {
      // Redirect to session expired page
      signOut({ callbackUrl: "/session-expired" });
    }
  }, [session, router]);

  // Also check manually if token is expired
  useEffect(() => {
    if (session?.user?.accessTokenExpires) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > session.user.accessTokenExpires) {
        signOut({ callbackUrl: "/session-expired" });
      }
    }
  }, [session, router]);
}
