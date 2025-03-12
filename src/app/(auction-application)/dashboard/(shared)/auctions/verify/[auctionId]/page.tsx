import React, { FC } from "react";
import VerifyAuction from "@/components/admin/verify-auction/VerifyAuction";
import { AuctionStatus } from "@/types/auctionTypes";
import { getServerSession } from "@/lib/serverSession";

type VerifyPageProps = {
  params: Promise<{ auctionId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const VerifyPage: FC<VerifyPageProps> = async ({ params, searchParams }) => {
  const auctionId = (await params).auctionId;

  const {
    title = "",
    description = "",
    item = "",
    start_datetime = "",
    end_datetime = "",
    buynow_price = "",
    bid_increment = "",
    status = "",
  } = await searchParams;

  const auctionDetails = {
    auction_id: auctionId,
    title: title as string,
    description: description as string,
    item: item as string,
    start_datetime: start_datetime as string,
    end_datetime: end_datetime as string,
    buynow_price: buynow_price as string,
    bid_increment: bid_increment as string,
    status: status as AuctionStatus,
  };

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

      <VerifyAuction
        auctionId={auctionId}
        auctionDetails={auctionDetails}
        token={token}
      />
    </div>
  );
};

export default VerifyPage;
