import React from "react";
import { getServerSession } from "@/lib/serverSession";
import KoiDetails from "@/components/admin/koi-details/KoiDetails";
import KoiAuctionForm from "@/components/admin/koi-auction-form/KoiAuctionForm";

export default async function UpdateAuctionPage({
  params,
  searchParams,
}: {
  params: Promise<{ auctionID: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const auctionID = (await params).auctionID;
  const { koiID = "" } = await searchParams;
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Update Auction Item
        </h1>
      </div>
      <div className="grid gap-4 md:min-h-[36rem] md:gap-6 lg:grid-cols-2">
        <KoiDetails koiID={koiID as string} />
        <KoiAuctionForm id={auctionID} token={token} operation="update" />
      </div>
    </div>
  );
}
