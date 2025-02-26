const roleAccessMap = {
  admin: [
    "/dashboard",
    "/dashboard/users",
    "/dashboard/users/[userID]",
    "/dashboard/inventory",
    "/dashboard/auctions",
    "/dashboard/auctions/item/[auctionID]",
    "/dashboard/auctions/add/[koiID]",
    "/dashboard/auctions/update/[auctionID]",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionsID]",
    "/dashboard/bids",
    "/dashboard/notifications",
  ],
  user: [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/profile-settings",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionsID]",
    "/dashboard/transactions/deposit",
    "/dashboard/notifications",
  ],
};

export default roleAccessMap;
