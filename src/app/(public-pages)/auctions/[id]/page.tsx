import AuctionDetails from "@/components/shared/auction-details/AuctionDetails/AuctionDetails";
import { getServerSession } from "@/lib/serverSession";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";
  const userId = session?.user.id;
  const isAdmin = session?.user.role === "admin";
  const auctionId = (await params).id;
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <AuctionDetails
          auctionID={auctionId}
          token={token}
          isAdmin={isAdmin}
          withBack={false}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default page;
