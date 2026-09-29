<script setup lang="ts">
import {
  ChevronRight,
  LayoutDashboard,
  Pickaxe,
  Plane,
  Settings,
} from "@lucide/vue";
import Button from "../ui/button/Button.vue";
import Logo from "./Logo.vue";
import { useRoute } from "vue-router";
import Chip from "../utils/chip.vue";

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
    name: "Planner",
    to: "/dashboard/planner",
    icon: Plane,
  },
  {
    name: "Preferences",
    to: "/dashboard/preferences",
    icon: Settings,
  },
];

const route = useRoute();

const getActiveRoute = (path: string): boolean => route.fullPath === path;
</script>

<template>
  <main class="fixed md:w-[100px] lg:w-[300px] p-5 space-y-10">
    <header>
      <Logo size="lg" containerClass="flex-col justify-center" />
    </header>

    <div class="h-px bg-terracotta w-full" />

    <div class="flex flex-col gap-3 transition-all">
      <!-- <Button
        variant="link"
        class="flex justify-between items-center group no-underline! hover:bg-cream/90 *:text-muted-foreground"
        :class="[
          getActiveRoute(route.to) &&
            'bg-terracotta *:text-cream hover:bg-terracotta/90',
        ]"
        size="lg"
        v-for="route in routes"
        :to="route.to"
      >
        <div class="flex justify-between items-center h-full">
          <div class="flex items-center gap-3">
            <component :is="route.icon" class="size-5 stroke-2" />
            <span class="block text-base font-normal">
              {{ route.name }}
            </span>
          </div>
          <ChevronRight />
        </div>
      </Button> -->
      <Chip
        v-for="route in routes"
        :class="[getActiveRoute(route.to) && '*:text-cream!']"
        :key="route.to"
        class="border-0 group no-underline! hover:bg-cream/100 bg-transparent shadow-none! *:text-muted-foreground"
        size="lg"
        :to="route.to"
        :active="getActiveRoute(route.to)"
        @click="$router.push(route.to)"
        :icon="route.icon"
        iconClass="z-20 text-crem"
        type="navigation"
      >
        <div class="flex items-center justify-between w-full gap-3 z-20">
          <!-- <component :is="route.icon" class="size-5 stroke-2" /> -->
          <span class="block text-base font-normal">
            {{ route.name }}
          </span>
        </div>
      </Chip>

      <!-- <Button
        variant="link"
        class="flex justify-between items-center group no-underline! bg-terracotta"
        size="lg"
            v-for="route in routes"
        :to="route.to"
      >
        <div class="flex items-center gap-3">
          <LayoutDashboard class="size-5 text-cream" />
          <span class="text-cream block text-base">Home</span>
        </div>
        <ChevronRight class="text-cream" />
      </Button> -->
    </div>
  </main>
</template>
