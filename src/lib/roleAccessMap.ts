const roleAccessMap = {
  admin: [
    "/dashboard",
    "/dashboard/users-management",
    "/dashboard/inventory",
    "/dashboard/auctions/add/[koiID]",
    "/dashboard/auctions",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionID]",
  ],
  user: [
    "/dashboard",
    "/dashboard/profile-settings",
    "/dashboard/transactions",
    "/dashboard/transactions/[transactionID]",
  ],
  "non-user": [
    "/",
    "/login",
    "/register",
    "/session-expired",
    "/403",
    "/article",
  ],
};

export default roleAccessMap;
