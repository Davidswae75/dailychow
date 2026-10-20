<script setup lang="ts">
import { computed } from "vue";
import { motion } from "motion-v";
import { type Dish, capitalize } from "@/lib";

const props = defineProps<{ nutrition: Dish["nutrition"] }>();

const levels: Record<string, number> = { light: 33, low: 33, moderate: 66, medium: 66, hearty: 100, high: 100 };

const rows = computed(() => [
  { label: "Energy", value: props.nutrition.calories, color: "bg-terracotta" },
  { label: "Protein", value: props.nutrition.protein, color: "bg-olive" },
  { label: "Carbs", value: props.nutrition.carbs, color: "bg-saffron" },
]);
</script>

<template>
  <dl class="grid grid-cols-[5rem_1fr_4.5rem] items-center gap-x-3 gap-y-2.5 text-sm">
    <template v-for="(row, i) in rows" :key="row.label">
      <dt>{{ row.label }}</dt>
      <dd class="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
        <motion.span
          class="block h-full rounded-full"
          :class="row.color"
          :initial="{ width: '0%' }"
          :while-in-view="{ width: `${levels[row.value] ?? 50}%` }"
          :in-view-options="{ once: true }"
          :transition="{ duration: 0.7, delay: 0.1 * i, ease: [0.21, 0.92, 0.25, 1] }"
        />
      </dd>
      <dd class="font-semibold">{{ capitalize(row.value) }}</dd>
    </template>
  </dl>
</template>
