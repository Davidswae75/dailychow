<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { motion } from "motion-v";
import { isActivePath, navItems } from "@/lib/navigation";

const route = useRoute();
const items = computed(() =>
  navItems.filter((item) => item.mobile).map((item) => ({ ...item, active: isActivePath(route.path, item.to) }))
);
</script>

<template>
  <!-- Glued to the bottom edge; frosted so the page shows through as it scrolls under -->
  <nav v-if="!route.meta.hideBottomBar" aria-label="Main" class="fixed inset-x-0 bottom-0 z-40 md:hidden">
    <motion.div
      class="glass backdrop-blur-lg [--glass-shadow:0_-10px_30px_-16px_oklch(0.45_0.08_50/0.3)] grid grid-cols-5 gap-0.5 rounded-t-[28px] border-t border-white/70 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      :initial="{ y: 40, opacity: 0 }"
      :animate="{ y: 0, opacity: 1 }"
      :transition="{ type: 'spring', stiffness: 380, damping: 30, delay: 0.2 }"
    >
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :aria-current="item.active ? 'page' : undefined"
        class="relative flex h-14 flex-col items-center justify-center gap-0.5 rounded-[20px] text-[11px] font-semibold transition-colors"
        :class="item.active ? 'text-paper' : 'text-ink hover:text-charcoal'"
      >
        <motion.span
          v-if="item.active"
          layout
          layout-id="bottom-nav-active"
          class="absolute inset-0 rounded-[20px] bg-terracotta-deep"
          :transition="{ type: 'spring', stiffness: 400, damping: 32 }"
        />
        <component :is="item.icon" class="relative size-5" />
        <span class="relative">{{ item.name }}</span>
      </RouterLink>
    </motion.div>
  </nav>
</template>
