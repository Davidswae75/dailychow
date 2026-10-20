import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import index from "../views/index.vue";
import DashboardRoutes from "./dashboardRoutes";
import { useAuthStore } from "@/store";

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
    meta: { guestOnly: true },
  },
  {
    path: "/onboarding/registration",
    name: "registration",
    component: () => import("@/views/onboarding/index.vue"),
    meta: { guestOnly: true },
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

/** True while a navigation is waiting on the auth check, drives the app's loading screen */
export const checkingAuth = ref(false);
router.afterEach(() => (checkingAuth.value = false));
router.onError(() => (checkingAuth.value = false));

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth && !to.meta.guestOnly) return;

  const authStore = useAuthStore();
  // Registration navigates on its own once the profile exists
  if (authStore.registering) return;
  if (authStore.pending) checkingAuth.value = true;
  await authStore.settled();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { path: "/sign-in", query: { redirect: to.fullPath } };
  }
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return "/dashboard/home";
  }
});
