const roleAccessMap = {
  admin: [
    "/dashboard",
    "/dashboard/users",
    "/dashboard/users/[userID]",
    "/dashboard/inventory",
    "/dashboard/auctions",
    "/dashboard/auctions/add/[koiID]",
    "/dashboard/auctions/update/[auctionID]",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionsID]",
    "/dashboard/bids",
  ],
  user: [
    "/dashboard",
    "/dashboard/profile-settings",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionsID]",
  ],
};

export default roleAccessMap;
