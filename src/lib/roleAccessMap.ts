const roleAccessMap = {
  admin: [
    "/",
    "/user-management",
    "/inventory",
    "/auctions/add/[koiID]",
    "/auctions",
    "/transactions",
  ],
  user: ["/", "/profile-settings"],
};

export default roleAccessMap;
