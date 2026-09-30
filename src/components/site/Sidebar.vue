<script setup lang="ts">
import { LayoutDashboard, Pickaxe, Plane, Settings, LogOut, Clock } from "@lucide/vue";
import Logo from "./Logo.vue";
import { useRoute } from "vue-router";
import Chip from "../utils/chip.vue";
import { useUserStore } from "@/store";
import Button from "../ui/button/Button.vue";
import { useAuth } from "@/hooks";

const { user } = useUserStore();
const { signOutUser } = useAuth();

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
  <main
    class="fixed md:w-[100px] lg:w-[300px] p-5 space-y-10 relative min-h-[95dvh]"
  >
    <header>
      <Logo size="lg" containerClass="flex-col justify-center" />
    </header>

    <div class="h-px bg-terracotta w-full" />

    <section class="flex flex-col gap-3 transition-all">
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
        <div
          class="flex items-center justify-between w-full gap-3 z-20 hidden lg:block"
        >
          <span class="block text-base font-normal">
            {{ route.name }}
          </span>
        </div>
      </Chip>
    </section>

    <section class="w-full absolute bottom-2">
      <div
        class="rounded-l-2xl border border-border bg-cream p-3 pr-10 space-y-2"
      >
        <p
          class="text-terracotta text-xs font-bold tracking-wide uppercase hidden lg:block"
        >
          Signed in
        </p>
        <p class="text-xs text-muted-foreground hidden lg:block">
          {{ user?.email || "swae@yahoo.com" }}
        </p>
        <Button
        @click="signOutUser"
          variant="outline"
          block="full"
          class="text-charcoal text-sm flex gap-2 justify-start items-center"
          ><LogOut class="size-4" />
          <span class="hidden lg:block">Sign out</span></Button
        >
      </div>
    </section>
  </main>
</template>
