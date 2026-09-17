import { createRouter, createWebHistory } from "vue-router";

import index from "../views/index.vue";
import Login from "@/views/auth/login.vue";
import onboardingRegistration from "@/views/onboarding/index.vue";

const routes = [
  {
    path: "/",
    component: index,
    meta: {
      layout: "default",
    },
  },
  { path: "/sign-in", component: Login },
  { path: "/onboarding/registration", component: onboardingRegistration },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
