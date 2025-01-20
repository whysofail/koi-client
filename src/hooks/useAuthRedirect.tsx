"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = (error: Error) => {
      if (error.name === "UnauthorizedError") {
        router.push("/session-expired");
      }
    };

    window.addEventListener("unhandledrejection", (event) => {
      handleUnauthorized(event.reason);
    });

    return () => {
      window.removeEventListener("unhandledrejection", (event) => {
        handleUnauthorized(event.reason);
      });
    };
  }, [router]);
};
