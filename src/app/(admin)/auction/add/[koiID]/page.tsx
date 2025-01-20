import React from "react";

const AddAuctionPage = async ({
  params,
}: {
  params: Promise<{ koiID: string }>;
}) => {
  const koiID = (await params).koiID;

  return <div>{koiID}</div>;
};

export default AddAuctionPage;
