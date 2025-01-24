const roleAccessMap = {
  admin: [
    "/",
    "/user-management",
    "/koi-inventory",
    "/auction/add/[koiID]",
    "/auctions",
  ],
  user: ["/", "/profile-settings", "/api/auth/refresh-token"],
};

export default roleAccessMap;
