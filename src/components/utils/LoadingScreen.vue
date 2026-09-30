<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";
import foodgif from "@/assets/warming-food.gif";

interface Props {
  image?: string;
  state: boolean;
  title?: string;
}

withDefaults(defineProps<Props>(), {
  image: foodgif,
  title: "Cooking Your Dashboard...",
  state: false
});
</script>

<template>
  <main class="relative">
    <AnimatePresence>
      <motion.section
        v-if="state"
        key="logging-in"
        :initial="{ opacity: 1 }"
        :exit="{
          opacity: 0,
          filter: 'blur(1px)',
          transition: { duration: 0.4, ease: 'easeInOut' },
        }"
        :transition="{ duration: 0.5 }"
        class="min-h-screen bg-terracotta flex justify-center items-center inset-0 absolute top-0 left-0 weave z-50"
      >
        <div>
          <img
            :src="image"
            alt="food-warming"
            class="object-fit aspect-auto size-32 mx-auto animate-steam"
          />
          <p class="font-display text-center font-bold text-cream animate-simmer">
            {{ title }}
          </p>
        </div>
      </motion.section>
    </AnimatePresence>
  </main>
</template>
