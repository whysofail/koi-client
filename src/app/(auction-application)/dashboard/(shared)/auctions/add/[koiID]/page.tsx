import React from "react";
import KoiAuctionForm from "@/components/admin/koi-auction-form/KoiAuctionForm";
import KoiDetails from "@/components/admin/koi-details/KoiDetails";
import { getServerSession } from "@/lib/serverSession";

const AddAuctionPage = async ({
  params,
}: {
  params: Promise<{ koiID: string }>;
}) => {
  const koiID = (await params).koiID;
  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Add to Auction
        </h1>
      </div>
      <div className="grid gap-4 md:min-h-[36rem] md:gap-6 lg:grid-cols-2">
        <KoiDetails koiID={koiID} />
        <KoiAuctionForm id={koiID} token={token} operation="create" />
      </div>
    </div>
  );
};

export default AddAuctionPage;
