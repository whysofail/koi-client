"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Define types for our custom event
interface AuthErrorEvent extends CustomEvent {
  detail: Error;
}

// Define type for error with potential name property
interface UnauthorizedError extends Error {
  name: string;
}

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = (error: UnauthorizedError): void => {
      if (error?.name === "UnauthorizedError") {
        router.push("/session-expired");
      }
    };

    // Handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      handleUnauthorized(event.reason as UnauthorizedError);
    };

    // Handler for custom auth error events
    const handleAuthError = (event: AuthErrorEvent): void => {
      handleUnauthorized(event.detail);
    };

    // Add event listeners with type assertions
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("auth-error", handleAuthError as EventListener);

    // Cleanup function
    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
      window.removeEventListener(
        "auth-error",
        handleAuthError as EventListener,
      );
    };
  }, [router]);
};
