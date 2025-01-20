"use client";
import React from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const AuthRedirectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useAuthRedirect();

  return <>{children}</>;
};

export default AuthRedirectProvider;
