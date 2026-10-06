<script setup lang="ts" generic="T extends Record<string,any>">
import type { Filter } from '@/components/utils/FilterSheet.vue';

interface FilterFoodProps {
  filter: Filter<T>;
  items: T[];

  options?: keyof T;
}

const props = defineProps<FilterFoodProps>();
</script>

<template>
  <main>
    <p>{{ filter.label }}</p>
    <div v-for="(item, i) in items" :key="i">
      {{ item[filter.value] }}
    </div>
  </main>
</template>
