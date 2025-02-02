const roleAccessMap = {
  admin: [
    "/dashboard",
    "/dashboard/users-management",
    "/dashboard/inventory",
    "/dashboard/auctions/add/[koiID]",
    "/dashboard/auctions",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionID]",
    "/dashboard/auctions/update/[auctionID]",
  ],
  user: [
    "/dashboard",
    "/dashboard/profile-settings",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionID]",
  ],
};

export default roleAccessMap;
