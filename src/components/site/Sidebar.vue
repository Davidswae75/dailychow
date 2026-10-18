<script setup lang="ts">
import { LogOut } from "@lucide/vue";
import Logo from "./Logo.vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { motion } from "motion-v";
import { useUserStore } from "@/store";
import Button from "../ui/button/Button.vue";
import { useAuth } from "@/composables/index.ts";
import { isActivePath, navItems as routes } from "@/lib";

const { user } = storeToRefs(useUserStore());
const { signOutUser } = useAuth();
const route = useRoute();

const getActiveRoute = (path: string): boolean => isActivePath(route.path, path);
</script>

<template>
  <main
    class="fixed md:w-[100px] lg:w-[300px] p-5 space-y-10 relative min-h-[95dvh]"
  >
    <header>
      <Logo size="lg" containerClass="flex-col justify-center" />
    </header>

    <div class="h-px bg-terracotta w-full" />

    <nav aria-label="Main" class="flex flex-col gap-1.5">
      <RouterLink
        v-for="item in routes"
        :key="item.to"
        :to="item.to"
        :aria-label="item.name"
        :aria-current="getActiveRoute(item.to) ? 'page' : undefined"
        class="relative flex h-12 items-center justify-center gap-3 rounded-full px-4 text-base transition-colors lg:justify-start"
        :class="getActiveRoute(item.to) ? 'text-paper font-semibold' : 'text-muted-foreground hover:bg-cream hover:text-charcoal'"
      >
        <motion.span
          v-if="getActiveRoute(item.to)"
          layout
          layout-id="sidebar-active"
          class="absolute inset-0 rounded-full bg-terracotta-deep"
          :transition="{ type: 'spring', stiffness: 400, damping: 32 }"
        />
        <component :is="item.icon" class="relative size-5 shrink-0" />
        <span class="relative hidden lg:block">{{ item.name }}</span>
      </RouterLink>
    </nav>

    <section class="w-full absolute left-0 px-1.5 lg:px-5 -bottom-5">
      <div
        class="rounded-2xl border border-border bg-cream p-3.5 pr-10 space-y-2"
      >
        <p
          class="text-terracotta text-xs font-bold tracking-wide uppercase hidden lg:block"
        >
          Signed in
        </p>
        <p class="text-xs text-muted-foreground hidden lg:block">
          {{ user?.email }}
        </p>
        <Button
        @click="signOutUser"
          variant="outline"
          block="full"
          class="text-charcoal text-sm flex gap-2 lg:justify-start justify-center items-center"
          ><LogOut class="size-4" />
          <span class="hidden lg:block">Sign out</span></Button
        >
      </div>
    </section>
  </main>
</template>
