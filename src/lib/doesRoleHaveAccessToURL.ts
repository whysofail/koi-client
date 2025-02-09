import roleAccessMap from "./roleAccessMap";

const compileRouteToRegex = (route: string) =>
  new RegExp(`^${route.replace(/\[.*?\]/g, "([^/]+)")}$`);

const precompiledRoutes: Record<string, RegExp[]> = Object.fromEntries(
  Object.entries(roleAccessMap).map(([role, routes]) => [
    role,
    routes.map(compileRouteToRegex),
  ]),
);

const doesRoleHaveAccessToURL = (
  role: keyof typeof roleAccessMap,
  url: string,
) => {
  const accessibleRoutes = precompiledRoutes[role] || [];
  return accessibleRoutes.some((regex) => regex.test(url));
};

export default doesRoleHaveAccessToURL;
