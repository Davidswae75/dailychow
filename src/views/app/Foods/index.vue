<script setup lang="ts">
import Chip from "@/components/utils/chip.vue";
import ContentCard from "@/components/utils/ContentCard.vue";
import FilterSheet, { type Filter } from "@/components/utils/FilterSheet.vue";
import { CookingPot } from "@lucide/vue";
import { computed, ref } from "vue";
import FilterFoods from "./FilterFoods.vue";
import { dishes, type Dish } from "@/lib/dishes";
import SearchInput from "@/components/utils/SearchInput.vue";

import DishCard from "@/components/utils/DishCard.vue";

const foods = ref<string[]>([]);

const filter: Filter<Dish>[] = [
  {
    label: "Category",
    value: "category",
  },
];

const search = ref("");

const filterDishes = computed(() => {
  const sL = search.value.toLowerCase();

  return dishes.filter((dish) => {
    const matchesCategoryFilter =
      foods.value.length === 0 || foods.value.includes(dish.category);

    const matchesSearch =
      !sL ||
      dish.name.toLowerCase().includes(sL) ||
      dish.category.toLowerCase().includes(sL);

    return matchesSearch && matchesCategoryFilter;
  });
});


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
            >All Available Dishes{{ foods }}</Chip
          >
        </template>
      </ContentCard>
    </div>

    <section>
      <div
        class="px-4 flex items-center justify-end text-end float-right md:w-3/5 w-full gap-2"
      >
        <SearchInput v-model="search" />
        <FilterSheet
          :items="dishes"
          :filters="filter"
          description="This is the description"
           @reset="foods = []"
           @apply=""
        >
          <template #filters>
            <FilterFoods
              v-for="f in filter"
              :key="f.label"
              :filter="f"
              :items="dishes"
              v-model="foods"
            />
          </template>
        </FilterSheet>
      </div>
    </section>

    <section
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full pt-5 px-4 mx-auto gap-2"
    >
      <DishCard v-for="dish in filterDishes" :key="dish.id" :dish="dish" />
    </section>
  </main>
</template>
