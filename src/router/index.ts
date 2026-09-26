import { createRouter, createWebHistory } from "vue-router";

import index from "../views/index.vue";
import onboardingRegistration from "@/views/onboarding/index.vue";
import DashboardRoutes from "./dashboardRoutes";
// import Login from "@/views/auth/Login.vue";

const routes = [
  {
    path: "/",
    component: index,
    name: "landing-page",
    meta: {
      layout: "default",
    },
  },
  {
    path: "/sign-in",
    name: "sign-in",
    component: () => import("@/views/auth/login.vue"),
  },
  {
    path: "/onboarding/registration",
    name: "registration",
    component: onboardingRegistration,
  },

  //for dashboard
  ...DashboardRoutes,

  
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/components/site/Error.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
