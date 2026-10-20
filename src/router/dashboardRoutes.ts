import Home from "@/views/app/home.vue";
import Planner from "@/views/app/Planner.vue";
import Pick from "@/views/app/Pick.vue";
import PickResult from "@/views/app/PickResult.vue";
import Preferences from "@/views/app/Preferences.vue";
import History from "@/views/app/History.vue";
import Foods from "@/views/app/Foods/index.vue";
import DishDetail from "@/views/app/Foods/DishDetail.vue";

const dashboardRoutes = [
  { path: "/dashboard/home", component: Home },
  { path: "/dashboard/planner", component: Planner },
  { path: "/dashboard/pick", component: Pick },
  {
    path: "/dashboard/pick/result",
    component: PickResult,
    // Has its own bottom action bar
    meta: { hideBottomBar: true },
  },
  { path: "/dashboard/preferences", component: Preferences },
  { path: "/dashboard/history", component: History },
  { path: "/dashboard/foods", component: Foods },
  {
    path: "/dashboard/foods/:id",
    component: DishDetail,
    meta: { hideBottomBar: true },
  },
].map((route) => ({
  ...route,
  meta: { ...("meta" in route ? route.meta : {}), layout: "dashboard", requiresAuth: true },
}));

export default dashboardRoutes;
