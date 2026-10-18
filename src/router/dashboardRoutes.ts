const dashboardRoutes = [
  { path: "/dashboard/home", component: () => import("@/views/app/home.vue") },
  { path: "/dashboard/planner", component: () => import("@/views/app/Planner.vue") },
  { path: "/dashboard/pick", component: () => import("@/views/app/Pick.vue") },
  {
    path: "/dashboard/pick/result",
    component: () => import("@/views/app/PickResult.vue"),
    // Has its own bottom action bar
    meta: { hideBottomBar: true },
  },
  { path: "/dashboard/preferences", component: () => import("@/views/app/Preferences.vue") },
  { path: "/dashboard/history", component: () => import("@/views/app/History.vue") },
  { path: "/dashboard/foods", component: () => import("@/views/app/Foods/index.vue") },
  {
    path: "/dashboard/foods/:id",
    component: () => import("@/views/app/Foods/DishDetail.vue"),
    meta: { hideBottomBar: true },
  },
].map((route) => ({
  ...route,
  meta: { ...("meta" in route ? route.meta : {}), layout: "dashboard", requiresAuth: true },
}));

export default dashboardRoutes;
