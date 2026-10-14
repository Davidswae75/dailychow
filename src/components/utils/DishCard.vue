<script setup lang="ts">
import type { Dish } from "@/lib/dishes";
import VImg from "v-lazy-image";
import DarkShade from "@/components/utils/DarkShade.vue";
import { motion } from "motion-v";

const props = withDefaults(
  defineProps<{
    dish: Dish;
    /** Position in a list, used to stagger the entrance */
    index?: number;
  }>(),
  { index: 0 }
);

// Cap the stagger so long lists don't keep the last cards waiting
const delay = Math.min(props.index, 12) * 0.04;
</script>

<template>
  <motion.div
    class="rounded-4xl h-56 md:h-72 lg:h-96 border border-border overflow-hidden relative group mx-auto cursor-pointer"
    :key="dish.id"
    :initial="{ opacity: 0, y: 22, scale: 0.94 }"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :exit="{ opacity: 0, y: 12, scale: 0.94 }"
    :while-hover="{ y: -6 }"
    :while-press="{ scale: 0.98 }"
    :transition="{ type: 'spring', stiffness: 400, damping: 32, delay }"
  >
    <div
      class="bg-saffron text-charcoal py-1.5 px-2 rounded-4xl text-xs font-normal absolute top-5 capitalize left-4 z-50"
    >
      {{ dish.category }}
    </div>
    <div class="size-full transition-transform duration-700 ease-out group-hover:scale-105">
      <v-img
        :src="dish.img"
        contain
        class="size-100 mx-auto object-cover text-center animate-float-slower"
      />
    </div>
    <DarkShade />
    <div
      class="absolute bottom-0 h-[4.5rem] z-20 border-t border-border backdrop-blur-sm w-full px-4 py-1 bg-charcoal/15"
    >
      <p class="font-bold font-display text-cream tracking-wide text-sm md:text-lg line-clamp-1">
        {{ dish.name }}
      </p>
      <p class="font-light text-xs text-paper line-clamp-2">
        {{ dish.note }}
      </p>
    </div>
  </motion.div>
</template>
