import React, { FC } from "react";
import { VerifyAuctionView } from "@/components/admin/verify-auction/VerifyAuctionView";
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
    reserve_price = "",
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
    reserve_price: reserve_price as string,
    bid_increment: bid_increment as string,
    status: status as AuctionStatus,
  };

  const session = await getServerSession();
  const token = session?.user?.accessToken ?? "";

  return (
    <VerifyAuctionView
      auctionId={auctionId}
      auctionDetails={auctionDetails}
      token={token}
    />
  );
};

export default VerifyPage;
