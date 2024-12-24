export const constructRouteParameters = (route) => {
  const routeParameterRegex = /:([a-zA-z]+)/g;
  const routeWithParameters = route.replace(routeParameterRegex, "(?<$1>[a-zA-Z0-9]+)");
  return new RegExp(`^${routeWithParameters}(?<query>\\?(.*))?$`);
};
