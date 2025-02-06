"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const BackButton = () => {
  const router = useRouter();
  const currentUrl = window.location.pathname; // Get the current URL

  const handleBack = () => {
    // Check if the URL contains a dynamic segment, like '/users/[user_id]'
    const basePath = currentUrl.split("/").slice(0, -1).join("/"); // Remove the last segment (user_id)
    router.push(basePath); // Navigate back to the parent path
  };

  return (
    <Button onClick={handleBack} className="flex items-center space-x-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span>Back</span>
    </Button>
  );
};

export default BackButton;
