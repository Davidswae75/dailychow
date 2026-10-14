<script setup lang="ts">
import { Flame } from "@lucide/vue";

/** Pepper level as five flames, `level` of them filled. */
defineProps<{ level: number }>();
</script>

<template>
  <span class="inline-flex items-center gap-0.5" role="img" :aria-label="`Pepper ${level} of 5`">
    <Flame
      v-for="n in 5"
      :key="n"
      class="size-3.5"
      :class="n <= level ? 'fill-terracotta text-terracotta' : 'text-line'"
      aria-hidden="true"
    />
  </span>
</template>
