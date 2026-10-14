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
  <nav v-if="!route.meta.hideBottomBar" aria-label="Main" class="fixed bottom-5 inset-x-0 z-40 md:hidden">
    <motion.div
      class="mx-auto grid w-[calc(100%-1.75rem)] max-w-md grid-cols-5 gap-0.5 rounded-3xl border border-border bg-cream/95 p-1.5 shadow-soft backdrop-blur-lg"
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
