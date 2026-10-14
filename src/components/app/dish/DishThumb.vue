<script setup lang="ts">
import VLazyImage from "v-lazy-image";
import { cn } from "@/lib/utils";
import type { Dish } from "@/lib/dishes";

/** A dish photo in a rounded frame. Decorative by default; pass `alt` when the image carries meaning. */
const props = defineProps<{ dish: Dish; alt?: string; class?: string }>();
</script>

<template>
  <span :class="cn('block shrink-0 overflow-hidden rounded-2xl bg-muted', props.class)">
    <v-lazy-image :src="dish.img" :alt="alt ?? ''" class="size-full object-cover" />
  </span>
</template>
