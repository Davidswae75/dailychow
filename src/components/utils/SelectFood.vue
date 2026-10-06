<script setup lang="ts">
import { dishes } from "@/lib/dishes";
import Chip from "./chip.vue";

const modDishes = dishes.map((d) => ({
  label: d.name,
  value: d.id,
}));

export interface FoodCategory {
  label: string;
  value: string;
}

const model = defineModel<string[]>({
  default: () => [],
});

const isSelected = (value: string) =>
  model.value.includes(value);

const handleSelection = (option: FoodCategory) => {
  const findOption = model.value.find((m) => m === option.value);

  if (findOption)
    model.value = model.value.filter((m) => m != findOption);
  else model.value = [...model.value, option.value];
};
</script>

<template>
  <main class="flex overflow-x-auto scrollbar-none gap-1">
    <Chip
      v-for="m in modDishes"
      :key="m.value"
      :variant="isSelected(m.value) ? 'secondary' : 'primary'"
      @click="handleSelection(m)"
      hover
      class="flex-shrink-0"
    >
      <span class="z-20 whitespace-nowrap">
        {{ m.label }}
      </span>
    </Chip>
    <!-- <p class="font-medium font-display text-olive ">~{{ model.length }}</p> -->
  </main>
</template>