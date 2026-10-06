<script setup lang="ts">
import { Clock, LayoutDashboard, Pickaxe, Plane, Settings } from "@lucide/vue";
import Chip from "../utils/chip.vue";
import { useRoute } from "vue-router";

const routes = [
  {
    name: "Home",
    to: "/dashboard/home",
    icon: LayoutDashboard,
  },
  {
    name: "Pick",
    to: "/dashboard/pick",
    icon: Pickaxe,
  },
  {
    name: "Foods",
    to: "/dashboard/foods",
    icon: Archive,
  },
  {
    name: "Planner",
    to: "/dashboard/planner",
    icon: Plane,
  },
  {
    name: "Preferences",
    to: "/dashboard/preferences",
    icon: Settings,
  },
  {
    name: "History",
    to: "/dashboard/history",
    icon: Clock,
  },
];

const route = useRoute();

const getActiveRoute = (path: string): boolean => route.fullPath === path;
</script>

<template>
  <main class="fixed bottom-5 left-0 md:hidden w-full">
    <div
      class="rounded-2xl border border-border h-16 w-11/12 mx-auto backdrop-blur-lg bg-cream/90"
    >
      <section class="flex justify-between gap-1 transition-all p-3">
        <Chip
          v-for="route in routes"
          :class="[getActiveRoute(route.to) && '*:text-cream!']"
          :key="route.to"
          class="border-0 group no-underline! hover:bg-cream/100 bg-transparent shadow-none! *:text-terracotta-deep"
          size="lg"
          :to="route.to"
          :active="getActiveRoute(route.to)"
          @click="$router.push(route.to)"
          :icon="route.icon"
          iconClass="z-20 text-crem size-5.5 mx-1"
          type="navigation"
        />
      </section>
    </div>
  </main>
</template>
