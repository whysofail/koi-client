import React from "react";
import { getServerSession } from "@/lib/serverSession";
import AuctionDetails from "@/components/shared/auction-details/AuctionDetails";

const AuctionItem = async ({
  params,
}: {
  params: Promise<{ auctionID: string }>;
}) => {
  const auctionID = (await params).auctionID;
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";
  const isAdmin = session?.user.role === "admin";

  return (
    <AuctionDetails isAdmin={isAdmin} auctionID={auctionID} token={token} />
  );
};

export default AuctionItem;
