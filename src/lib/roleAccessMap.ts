const roleAccessMap = {
  admin: ["/", "/user-management", "/koi-inventory", "/auction/add/[koiID]"],
  user: ["/", "/profile-settings", "/api/auth/refresh-token"],
};

export default roleAccessMap;
