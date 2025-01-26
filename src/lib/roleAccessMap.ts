const roleAccessMap = {
  admin: [
    "/",
    "/user-management",
    "/inventory",
    "/auctions/add/[koiID]",
    "/auctions",
  ],
  user: ["/", "/profile-settings"],
};

export default roleAccessMap;
