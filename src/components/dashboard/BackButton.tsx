"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { FC } from "react";

type BackButtonProps = {
  className?: string;
};

const BackButton: FC<BackButtonProps> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      const basePath = pathname.split("/").slice(0, -1).join("/") || "/";
      router.push(basePath);
    }
  };

  return (
    <Button
      onClick={handleBack}
      className={cn("flex items-center space-x-2", className)}
    >
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
