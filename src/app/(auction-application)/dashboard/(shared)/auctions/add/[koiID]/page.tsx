import React from "react";
import KoiAuctionForm from "@/components/admin/koi-auction-form/KoiAuctionForm";
import KoiDetailsAdd from "@/components/admin/koi-details/KoiDetailsAdd";
import { getServerSession } from "@/lib/serverSession";

const AddAuctionPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ koiID: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const koiID = (await params).koiID;
  const {
    koiCode = "",
    nickname = "",
    gender = "",
    breeder = "",
    variety = "",
    size = "",
  } = await searchParams;

  const koiData = {
    code: koiCode as string,
    nickname: nickname as string,
    gender: gender as string,
    breeder: breeder as string,
    variety: variety as string,
    size: size as string,
  };

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
        <KoiDetailsAdd koiID={koiID} koiData={koiData} />
        <KoiAuctionForm id={koiID} token={token} operation="create" />
      </div>
    </div>
  );
};

export default AddAuctionPage;
