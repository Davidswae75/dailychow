<script setup lang="ts">
import Chip from "@/components/utils/chip.vue";
import ContentCard from "@/components/utils/ContentCard.vue";
import FilterSheet, { type Filter } from "@/components/utils/FilterSheet.vue";
import SelectFood from "@/components/utils/SelectFood.vue";
import { CookingPot } from "@lucide/vue";
import { ref } from "vue";

const foods = ref<string[]>([]);

interface Menu {
  name: string;
  category: string;
  color?: string;
}

const menu: Menu[] = [
  {
    name: "Egusi",
    category: "Soup",
    color: 'blue',
  },
  {
    name: "Jollof Rice",
    category: "Rice",
  },
  {
    name: "Porridge Beans",
    category: "Beans",
  },
];

const filter: Filter<Menu>[] = [
  {
    label: "Category",
    value: 'category'
  },
  {
    label: 'Name',
    value: 'name'
  }
];
</script>

<template>
  <main class="md:px-8 py-5 space-y-4">
    <div class="grid md:grid-cols-[1.2fr_1fr]">
      <ContentCard
        class="bg-cream"
        header
        title="Nigerian foods, pairings and details in one place."
        description="Search by dish, ingredient or pairing. Open any plate to see what goes with it, allergens, meal times and nutrition-style guidance."
      >
        <template #eyebrow>
          <Chip
            variant="saffron"
            class="inline-block !py-1 font-bold"
            :icon="CookingPot"
            >All Available Dishes</Chip
          >
        </template>
      </ContentCard>
    </div>

    <div class="px-4">
      <FilterSheet :items="menu" :filter-keys="filter"/>
      <!-- <SelectFood v-model="foods" /> -->
    </div>
  </main>
</template>
