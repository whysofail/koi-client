import React, { FC } from "react";
import VerifyAuction from "@/components/admin/verify-auction/VerifyAuction";
import { getServerSession } from "@/lib/serverSession";

type VerifyPageProps = {
  params: Promise<{ auctionId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const VerifyPage: FC<VerifyPageProps> = async ({ params }) => {
  const auctionId = (await params).auctionId;
  const session = await getServerSession();
  const token = session?.user?.accessToken ?? "";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verify Auction</h1>
          <p className="text-muted-foreground">
            Verify the highest bid and winner for this auction.
          </p>
        </div>
      </div>

      <VerifyAuction auctionId={auctionId} token={token} />
    </div>
  );
};

export default VerifyPage;
