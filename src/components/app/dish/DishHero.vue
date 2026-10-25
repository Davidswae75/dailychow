<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft } from "@lucide/vue";
import { AnimatePresence, motion } from "motion-v";
import VLazyImage from "v-lazy-image";
import type { Dish } from "@/lib";
import Shade from "@/components/utils/Shade.vue";

/**
 * Big dish photo with a back button and category tag; extra buttons go in the `actions` slot.
 * Back steps through history; `backTo` is only used when the page was opened directly.
 */
const props = defineProps<{ dish: Dish; backTo: string; backLabel: string }>();

const router = useRouter();
function goBack() {
  if (window.history.state?.back) router.back();
  else router.push(props.backTo);
}
</script>

<template>
  <div class="relative h-80 overflow-hidden bg-charcoal md:h-full md:min-h-[28rem] md:rounded-[34px]">
    <AnimatePresence>
      <motion.div
        :key="dish.id"
        class="absolute inset-0"
        :initial="{ opacity: 0, scale: 1.06 }"
        :animate="{ opacity: 1, scale: 1 }"
        :exit="{ opacity: 0 }"
        :transition="{ duration: 0.45 }"
      >
        <v-lazy-image :src="dish.img" :alt="dish.name" class="size-full object-cover" />
      </motion.div>
    </AnimatePresence>
    <!-- <div class="absolute inset-0 bg-linear-to-b from-charcoal/45 to-charcoal/0 to-40%" aria-hidden="true" /> -->
     <Shade from="full" :strength="0.15"/>

    <button
      type="button"
      :aria-label="backLabel"
      class="absolute top-4 left-4 grid size-11 place-items-center rounded-full bg-paper text-charcoal shadow-soft transition-transform active:scale-95"
      @click="goBack"
    >
      <ArrowLeft class="size-5" />
    </button>
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <slot name="actions" />
      <span class="rounded-full bg-saffron px-3 py-1.5 text-xs font-semibold text-charcoal capitalize">
        {{ dish.category }}
      </span>
    </div>
  </div>
</template>
