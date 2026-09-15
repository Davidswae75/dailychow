<script setup lang="ts">
import Chip from "../utils/chip.vue";

interface Props {
  index: number;
  dish: {
    img: string;
    name: string;
    note: string;
    tags: string[];
  };
}

defineProps<Props>();
</script>

<template>
  <figure
    class="w-60 group relative rounded-4xl p-4 overflow-hidden border"
    :class="index % 3 === 0 ? 'h-72' : 'h-80'"
  >

  <div class="bg-linear-to-t from-charcoal/50 to-charcoal/0 z-10 absolute inset-0 top-0"></div>
    <img
      :src="dish.img"
      class="object-cover aspect-square group-hover:scale-105 ease-in-out duration-300 transition-all absolute inset-0 top-0 h-full w-full"
    />

    <div class="space-y-1 absolute bottom-5 z-20">
      <p class="text-cream font-text font-bold">{{ dish.name }}</p>
      <p class="text-xs text-cream font-light">{{ dish.note }}</p>
      <div class="flex gap-1">
        <Chip v-for="tag in dish.tags" :key="tag" variant="accent">
          {{ tag }}
        </Chip>
      </div>
    </div>
  </figure>
</template>
