<script setup lang="ts">
import { Clock, LayoutDashboard, Pickaxe, Plane, Settings } from '@lucide/vue';
import Chip from '../utils/chip.vue';
import { useRoute } from 'vue-router';


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
        <div class="rounded-2xl border border-border h-16 w-11/12 mx-auto backdrop-blur-lg bg-cream/50">
            <section class="flex justify-between  gap-3 transition-all p-3">
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
        iconClass="z-20 text-crem size-5"
        type="navigation"
      >
        <!-- <div
          class="flex flex-col items-center justify-between w-full gap-3 z-20 hidden lg:block"
        >
          <span class="block text-base font-normal">
            {{ route.name }}
          </span>
        </div> -->
      </Chip>
    </section>
        </div>
    </main>
</template>