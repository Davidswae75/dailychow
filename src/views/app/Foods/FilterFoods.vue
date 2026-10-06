<script setup lang="ts" generic="T extends Record<string,any>">
import Chip from "@/components/utils/chip.vue";
import type { Filter } from "@/components/utils/FilterSheet.vue";
import { useScreenSize } from "@/hooks";
import { computed } from "vue";

interface FilterFoodProps {
  filter: Filter<T>;
  items: T[];
}

const props = defineProps<FilterFoodProps>();

const model = defineModel<string[]>({
  default: () => [],
});

const isSelected = (value: string) => model.value.includes(value);

const uniqueKeys = computed(() => {
  const { filter, items } = props;

  const keys = items.map((item) => item[filter.value]);
  return new Set(keys);
});

const handleSelection = (food: string) => {
  const findOption = model.value.find((m) => m === food);

  if (findOption) model.value = model.value.filter((m) => m != findOption);
  else model.value = [...model.value, food];
};

const { greaterThan } = useScreenSize();
</script>

<template>
  <div class="px-4 space-y-2">
    <p class="text-terracotta font-bold font-sans text-xs uppercase">
      {{ filter.label }}
    </p>
    <div class="flex flex-wrap gap-1">
      <Chip
        v-for="(key, i) in uniqueKeys"
        :key="key"
        :hover="greaterThan('md')"
        :class="isSelected(key) && 'shadow! shadow-terracotta'"
        @click="handleSelection(key)"
        :variant="isSelected(key) ? 'secondary' : 'primary'"
      >
        <span class="z-20 capitalize">{{ key }}</span>
      </Chip>
    </div>
  </div>
</template>
