<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { AnimatePresence, motion } from "motion-v";
import Logo from "../site/Logo.vue";
import DishSearch from "./topbar/DishSearch.vue";
import TonightChip from "./topbar/TonightChip.vue";
import UserMenu from "./topbar/UserMenu.vue";
import { navItemFor } from "@/lib/navigation";
import { formatLongDate } from "@/lib/dates";

/**
 * Dashboard top bar: where you are (title on desktop, logo on phones),
 * search, tonight's pick and the account menu. Frosted to match the bottom nav.
 */
const route = useRoute();
const title = computed(() => navItemFor(route.path)?.name ?? "Daily Chow");
const today = formatLongDate(new Date());
</script>

<template>
  <header
    class="glass sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/70 px-4 md:h-[4.5rem] md:rounded-t-[40px] md:px-8"
  >
    <RouterLink to="/dashboard/home" aria-label="Daily Chow home" class="md:hidden">
      <Logo name="" size="sm" />
    </RouterLink>

    <div class="hidden min-w-0 flex-col md:flex">
      <span class="text-xs text-ink">{{ today }}</span>
      <AnimatePresence mode="wait">
        <motion.span
          :key="title"
          class="font-display text-xl leading-tight font-bold text-charcoal"
          :initial="{ opacity: 0, y: 6 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: -6 }"
          :transition="{ duration: 0.2 }"
        >
          {{ title }}
        </motion.span>
      </AnimatePresence>
    </div>

    <div class="ml-auto flex items-center gap-2">
      <DishSearch />
      <TonightChip />
      <UserMenu />
    </div>
  </header>
</template>
