<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import foodgif from "@/assets/warming-food.gif";
import Logo from "@/components/site/Logo.vue";

interface Props {
  image?: string;
  state: boolean;
  title?: string;
  subtitle?: string;
}

withDefaults(defineProps<Props>(), {
  image: foodgif,
  title: "Warming up the pot…",
  subtitle: "Checking who's at the table",
  state: false,
});
</script>

<template>
  <AnimatePresence>
    <motion.section
      v-if="state"
      key="loading-screen"
      role="status"
      aria-live="polite"
      :initial="{ opacity: 1 }"
      :exit="{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }"
      class="fixed inset-0 z-[990] grid place-items-center bg-terracotta text-cream weave px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
      <!-- Only shows the loader after a short delay, so a fast auth check never flashes it -->
      <motion.div
        :initial="{ opacity: 0, y: 12 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.25, ease: [0.21, 0.92, 0.25, 1] }"
        class="flex flex-col items-center text-center"
      >
        <div class="relative">
          <span class="absolute inset-0 -z-10 rounded-full bg-cream/10 blur-2xl scale-125" />
          <img :src="image" alt="" class="size-32 md:size-40 object-contain animate-simmer" />
        </div>

        <p class="mt-6 font-display text-2xl md:text-3xl font-bold">{{ title }}</p>
        <p class="mt-1.5 text-sm text-cream/75">{{ subtitle }}</p>

        <div class="mt-6 h-1 w-40 overflow-hidden rounded-full bg-cream/20">
          <div class="h-full w-1/2 rounded-full bg-cream animate-loading-bar" />
        </div>
      </motion.div>

      <Logo bg containerClass="absolute bottom-[calc(env(safe-area-inset-bottom)+2rem)] opacity-90 [&_p]:text-cream" />
    </motion.section>
  </AnimatePresence>
</template>
