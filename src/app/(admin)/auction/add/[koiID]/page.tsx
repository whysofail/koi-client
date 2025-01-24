import React from "react";
import KoiAuctionForm from "@/components/admin/koi-auction-form/KoiAuctionForm";
import KoiDetails from "@/components/admin/koi-details/KoiDetails";
import { getServerSession } from "@/lib/ServerSession";

const AddAuctionPage = async ({
  params,
}: {
  params: Promise<{ koiID: string }>;
}) => {
  const koiID = (await params).koiID;
  const session = await getServerSession();
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Add to Auction</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <KoiDetails koiID={koiID} />
        <KoiAuctionForm koiID={koiID} token={session?.user.accessToken ?? ""} />
      </div>
    </div>
  );
};

export default AddAuctionPage;
