<script setup lang="ts">
import Chip from "@/components/utils/chip.vue";
import PageHeader from "@/components/app/common/PageHeader.vue";
import FilterSheet, { type Filter } from "@/components/utils/FilterSheet.vue";
import { CookingPot } from "@lucide/vue";
import { computed, ref } from "vue";
import FilterFoods from "./FilterFoods.vue";
import { dishes, type Dish } from "@/lib";
import SearchInput from "@/components/utils/SearchInput.vue";
import DishCard from "@/components/utils/DishCard.vue";
import { refDebounced } from "@vueuse/core";

const foods = ref<string[]>([]);

const filter: Filter<Dish>[] = [
  {
    label: "Category",
    value: "category",
  },
];

const search = ref("");
const debouncedSearch = refDebounced(search, 500);

const filterDishes = computed(() => {
  const sL = debouncedSearch.value.toLowerCase();

  return dishes.filter((dish) => {
    const matchesCategoryFilter =
      foods.value.length === 0 || foods.value.includes(dish.category);

    const matchesSearch =
      !sL ||
      [dish.name, dish.category, ...dish.ingredients, ...dish.sides].some(
        (text) => text.toLowerCase().includes(sL)
      );

    return matchesSearch && matchesCategoryFilter;
  });
});
</script>

<template>
  <main
    class="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 pb-32 md:px-8 md:pb-10"
  >
    <div class="flex flex-wrap items-end justify-between gap-5">
      <PageHeader
        title="Nigerian foods, pairings and details in one place"
        description="Search by dish, ingredient or pairing. Open any plate to see what goes with it, allergens, meal times and how filling it is."
      >
      </PageHeader>
      <div class="flex w-full items-center gap-2 md:w-auto md:min-w-[26rem]">
        <SearchInput v-model="search" class="grow" />
        <FilterSheet
          :items="dishes"
          :filters="filter"
          title="Filter dishes"
          description="Show only the categories you pick."
          @reset="foods = []"
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
    </div>

    <p class="-mb-2 text-sm text-ink" aria-live="polite">
      <Chip
        variant="saffron"
        class="mr-2 inline-flex py-1! font-bold"
        :icon="CookingPot"
        >{{ dishes.length }} dishes</Chip
      >
      {{ filterDishes.length }} shown
    </p>

    <section
      v-if="filterDishes.length"
      class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
    >
      <RouterLink
        v-for="(dish, i) in filterDishes"
        :key="dish.id"
        :to="`/dashboard/foods/${dish.id}`"
        :aria-label="dish.name"
        class="rounded-4xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-deep"
      >
        <DishCard :dish="dish" :index="i" class="w-full" />
      </RouterLink>
    </section>
    <p v-else class="py-16 text-center text-ink">
      {{
        search
          ? `No dish matches “${search}”. Try a dish, ingredient or side.`
          : "No dish in those categories."
      }}
    </p>
  </main>
</template>
