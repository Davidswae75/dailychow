import { createRouter, createWebHistory } from "vue-router";

import index from "../views/index.vue";
import onboardingRegistration from "@/views/onboarding/index.vue";
import DashboardRoutes from "./dashboardRoutes";
// import Login from "@/views/auth/Login.vue";

const routes = [
  {
    path: "/",
    component: index,
    meta: {
      layout: "default",
    },
  },
  { path: "/sign-in", component: () => import("@/views/auth/Login.vue") },
  { path: "/onboarding/registration", component: onboardingRegistration },

  //for dashboard
  ...DashboardRoutes,
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
