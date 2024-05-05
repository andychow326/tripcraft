interface AppRoute {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (...args: any[]) => string;
}

const asAppRouteTypes = <T extends { [K in keyof T]: AppRoute }>(et: T): T =>
  et;

const AppRoutes = asAppRouteTypes(
  Object.freeze({
    HomeScreen: { path: "/" },
    PlanCreateScreen: { path: "/plan/create" },
    PlanScreen: {
      path: "/plan/:planId",
      render: (planId: string) => `/plan/${planId}`,
    },
  }),
);

export default AppRoutes;
