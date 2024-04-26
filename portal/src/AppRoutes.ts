interface AppRoute {
  path: string;
  render?: (...args: unknown[]) => string;
}

const asAppRouteTypes = <T extends { [K in keyof T]: AppRoute }>(et: T): T =>
  et;

const AppRoutes = asAppRouteTypes(
  Object.freeze({
    HomeScreen: { path: "/" },
  }),
);

export default AppRoutes;
