import React from "react";
import { getServerSession } from "@/lib/serverSession";
import KoiDetails from "@/components/admin/koi-details/KoiDetails";
import KoiAuctionForm from "@/components/admin/koi-auction-form/KoiAuctionForm";
import { AuctionStatus } from "@/types/auctionTypes";
import BackButton from "@/components/dashboard/BackButton";

export default async function UpdateAuctionPage({
  params,
  searchParams,
}: {
  params: Promise<{ auctionID: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const auctionID = (await params).auctionID;
  const {
    koiID = "",
    title = "",
    description = "",
    reserve_price = "",
    bid_increment = "",
    status = "",
  } = await searchParams;

  const initialData = {
    title: title as string,
    description: description as string,
    item: koiID as string,
    reserve_price: parseFloat(reserve_price as string) || 0,
    bid_increment: parseFloat(bid_increment as string) || 0,
    status: status as AuctionStatus,
    rich_description: "",
    participation_fee: 0,
  };

  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <BackButton />
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Update Auction Item
        </h1>
      </div>
      <div className="grid gap-4 md:min-h-[36rem] md:gap-6 lg:grid-cols-2">
        <KoiDetails koiID={koiID as string} />
        <KoiAuctionForm
          id={auctionID}
          token={token}
          operation="update"
          initialData={initialData}
        />
      </div>
    </div>
  );
}
