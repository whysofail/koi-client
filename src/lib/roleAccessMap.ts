const roleAccessMap = {
  admin: [
    "/",
    "/user-management",
    "/inventory",
    "/auctions/add/[koiID]",
    "/auctions",
    "/transactions",
    "/transactions/[transactionID]",
  ],
  user: [
    "/",
    "/profile-settings",
    "/transactions",
    "/transactions/[transactionID]",
  ],
};

export default roleAccessMap;
