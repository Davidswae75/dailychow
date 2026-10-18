<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import { RefreshCw } from "@lucide/vue";
import VLazyImage from "v-lazy-image";
import { type Recommendation, dishFacts, whyText, capitalize } from "@/lib";
import Shade from "@/components/utils/Shade.vue";

/** The big terracotta card with tonight's dish. */
defineProps<{ pick: Recommendation; mealLabel: string }>();
defineEmits<{ another: [] }>();
</script>

<template>
  <section
    aria-label="Tonight's pick"
    class="weave isolate relative flex min-h-52 flex-col justify-between gap-6 overflow-hidden rounded-[34px] bg-terracotta-deep p-6 text-paper md:p-7"
  >
    <AnimatePresence>
      <motion.div
        :key="pick.dish.id"
        class="absolute -z-10 -top-8 -right-16 size-72 md:-right-10 md:size-96"
        :initial="{ opacity: 0, scale: 0.85, rotate: -18 }"
        :animate="{ opacity: 1, scale: 1, rotate: 0 }"
        :exit="{ opacity: 0, scale: 1.06, rotate: 8 }"
        :transition="{ type: 'spring', stiffness: 220, damping: 26 }"
        aria-hidden="true"
      >
        <v-lazy-image :src="pick.dish.img" alt="" class="size-100 md:size-120 animate-float-slower object-cover" />
      </motion.div>
    </AnimatePresence>
    <div
      class="absolute inset-0 -z-10 bg-linear-to-r from-terracotta-deep from-55% to-terracotta-deep/0 to-100%"
      aria-hidden="true"
    />
    <Shade from="right" :strength="0.25" class="-z-10" />

    <div class="relative max-w-sm space-y-2">
      <p class="text-sm font-semibold">{{ capitalize(mealLabel) }} pick for you</p>
      <AnimatePresence mode="wait">
        <motion.h2
          :key="pick.dish.id"
          class="text-4xl md:text-5xl leading-none text-saffron"
          :initial="{ opacity: 0, y: 10 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: -6 }"
        >
          {{ pick.dish.name }}
        </motion.h2>
      </AnimatePresence>
      <p class="text-[15px] leading-relaxed">{{ whyText(pick.reasons, pick.dish.note) }}</p>
    </div>

    <div class="relative flex flex-wrap items-center gap-2">
      <RouterLink
        to="/dashboard/pick/result"
        class="inline-flex h-11 items-center rounded-full bg-saffron px-5 text-[15px] font-bold text-charcoal transition-transform active:scale-95"
      >
        See what you need
      </RouterLink>
      <button
        type="button"
        aria-label="Pick another dish"
        class="grid size-11 place-items-center rounded-full border border-paper/50 transition-colors hover:bg-paper/10"
        @click="$emit('another')"
      >
        <RefreshCw class="size-4" />
      </button>
      <!-- <span class="hidden h-9 items-center rounded-full border border-paper/40 px-3.5 text-[13px] font-semibold sm:inline-flex">
        {{ dishFacts(pick.dish) }}
      </span> -->
    </div>
  </section>
</template>
