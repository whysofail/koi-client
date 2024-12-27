import roleAccessMap from "./roleAccessMap";

const doesRoleHaveAccessToURL = (
  role: keyof typeof roleAccessMap,
  url: string,
) => {
  const accessibleRoutes = roleAccessMap[role] || [];
  return accessibleRoutes.some((route) => {
    const regexPattern = route.replace(/\[.*?\]/g, "[^/]+").replace("/", "\\/");
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  });
};

export default doesRoleHaveAccessToURL;
