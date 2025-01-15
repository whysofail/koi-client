import { auth } from "@/auth";
import { cache } from "react";

export const getServerSession = cache(async () => {
  return await auth();
});
