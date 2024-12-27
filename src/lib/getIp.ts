import { headers } from "next/headers";

export const getIp = async () => {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0];
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
};
