<script setup lang="ts">
import { Clock, Flame } from "@lucide/vue";
import { type Dish, formatMinutes, pepperText } from "@/lib";

/** Time and pepper for a dish as small chips. `onDark` for photo or dark backgrounds. */
withDefaults(defineProps<{ dish: Dish; onDark?: boolean }>(), { onDark: false });
</script>

<template>
  <ul class="flex flex-wrap gap-1.5" aria-label="Dish facts">
    <li
      v-for="fact in [
        { icon: Clock, text: formatMinutes(dish.minutes) },
        { icon: Flame, text: pepperText(dish.spice) },
      ]"
      :key="fact.text"
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-semibold"
      :class="onDark ? 'border border-paper/40 text-paper' : 'border border-border bg-paper text-charcoal'"
    >
      <component :is="fact.icon" class="size-3.5" aria-hidden="true" />
      {{ fact.text }}
    </li>
  </ul>
</template>
