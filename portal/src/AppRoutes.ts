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
    PlanCreateScreen: { path: "/path/create" },
    PlanEditScreen: {
      path: "/path/edit/:planId",
      render: (planId: string) => `/path/edit/${planId}`,
    },
  }),
);

export default AppRoutes;
