<script setup lang="ts">
import { motion } from "motion-v";
import type { Dish } from "@/lib/dishes";
import DishThumb from "./DishThumb.vue";

/** A square photo tile that opens the dish. Used in horizontal "try these" rows. */
defineProps<{ dish: Dish }>();
</script>

<template>
  <motion.div :while-hover="{ y: -4 }" :while-press="{ scale: 0.97 }" class="shrink-0">
    <RouterLink
      :to="`/dashboard/foods/${dish.id}`"
      class="relative block size-40 md:size-44 overflow-hidden rounded-[26px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-deep"
    >
      <DishThumb :dish="dish" class="size-full rounded-none" />
      <span class="absolute inset-0 bg-linear-to-t from-charcoal/80 to-charcoal/0 to-60%" aria-hidden="true" />
      <span class="absolute top-3 left-3 rounded-full bg-saffron px-2.5 py-1 text-xs font-medium text-charcoal capitalize">
        {{ dish.category }}
      </span>
      <span class="absolute inset-x-3.5 bottom-3 font-display text-base font-bold leading-tight text-paper">
        {{ dish.name }}
      </span>
    </RouterLink>
  </motion.div>
</template>
