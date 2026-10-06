<script setup lang="ts">
import type { Dish } from "@/lib/dishes";
import VImg from "v-lazy-image";
import DarkShade from "@/components/utils/DarkShade.vue";
import Chip from "./chip.vue";
import { motion } from "motion-v";

interface DishCardProps {
  dish: Dish;
}

defineProps<DishCardProps>();
</script>

<template>
  <motion.div
    class="h-96 rounded-4xl border border-border overflow-hidden relative group mx-auto w-4/5 md:w-full"
    :key="dish.id"
    :initial="{
      y: 22,
      scale: 0.9
    }"
    :animate="{
      y:0,
      scale: 1
    }"
    :exit="{
      y: 12,
      scale: 0.9
    }"
    :transition="{
      type: 'spring',
        stiffness: 400,
        damping: 32,
    }"
  >
  
  <!-- <Chip class="absolute top-10 left-[40%] z-50 inline-block" variant="saffron"><span>{{dish.category}}</span></Chip> -->
   <div class="bg-saffron text-charcoal py-1 5 px-2 rounded-4xl text-sm font-medium absolute top-5 capitalize left-[40%] z-50">{{ dish.category }}</div>
  <v-img
      :src="dish.img"
      cover
      class="size-100 mx-auto object-fill aspect-auto text-center bg-center group-hover:scale-105 animate-float-slower"
    />
    <DarkShade />
    <div
      class="absolute bottom-0 h-24 z-20 border-t border-border bg-transparent backdrop-blur-sm w-full px-4 py-1.5"
    >
      <p class="font-bold font-display text-cream tracking-wide">
        {{ dish.name }}
      </p>
      <p class="font-light text-xs text-paper line-clamp-3">
        {{ dish.note }}
      </p>
    </div>
  </motion.div>
</template>
