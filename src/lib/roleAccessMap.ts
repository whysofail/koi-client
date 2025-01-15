const roleAccessMap = {
  admin: ["/", "/user-management", "/api/auth/refresh-token"],
  user: ["/", "/profile-settings", "/api/auth/refresh-token"],
};

export default roleAccessMap;
