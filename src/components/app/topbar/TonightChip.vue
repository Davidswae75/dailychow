<script setup lang="ts">
import { storeToRefs } from "pinia";
import { AnimatePresence, motion } from "motion-v";
import DishThumb from "../dish/DishThumb.vue";
import { usePickStore } from "@/store";
import { labelOf, mealOptions } from "@/lib";

/** Tonight's pick, always one tap away: a photo bubble on phones, photo + name on desktop. */
const { current, answers } = storeToRefs(usePickStore());
</script>

<template>
  <RouterLink
    v-if="current"
    to="/dashboard/pick/result"
    :aria-label="`${labelOf(mealOptions, answers.meal)} pick: ${current.dish.name}`"
    class="flex h-10 items-center gap-2.5 rounded-full border border-border bg-paper/80 p-1 transition-colors hover:border-terracotta-deep 2xl:pr-4"
  >
    <span class="relative size-8 overflow-hidden rounded-full ring-2 ring-saffron">
      <AnimatePresence>
        <motion.span
          :key="current.dish.id"
          class="absolute inset-0"
          :initial="{ opacity: 0, scale: 0.7, rotate: -20 }"
          :animate="{ opacity: 1, scale: 1, rotate: 0 }"
          :exit="{ opacity: 0, scale: 1.2 }"
          :transition="{ type: 'spring', stiffness: 260, damping: 22 }"
        >
          <DishThumb :dish="current.dish" class="size-full rounded-full" />
        </motion.span>
      </AnimatePresence>
    </span>
    <span class="hidden flex-col leading-tight 2xl:flex">
      <span class="text-[11px] font-semibold tracking-wide text-ink uppercase">
        {{ labelOf(mealOptions, answers.meal) }} pick
      </span>
      <span class="max-w-40 truncate text-sm font-bold text-charcoal">{{ current.dish.name }}</span>
    </span>
  </RouterLink>
</template>
