<script setup lang="ts">
import Chip from "@/components/utils/chip.vue";
import ContentCard from "@/components/utils/ContentCard.vue";
import FilterSheet, { type Filter } from "@/components/utils/FilterSheet.vue";
import { CookingPot, Search } from "@lucide/vue";
import { ref } from "vue";
import FilterFoods from "./FilterFoods.vue";
import { dishes, type Dish } from "@/lib/dishes";
import Input from "@/components/ui/input/Input.vue";
const foods = ref<string[]>([]);


const filter: Filter<Dish>[] = [
  {
    label: "Category",
    value: "category",
  },
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

    <div class="px-4 flex items-center justify-end text-end float-right md:w-3/5 w-full  gap-2">
      <Input name="foodSearch" input-class="inline-block">
        <template #append-icon>
          <Search class="text-muted-foreground"/>
        </template>
      </Input>
      <FilterSheet :items="dishes" :filters="filter" description="This is the description">
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
      <!-- <SelectFood v-model="foods" /> -->
    </div>
  </main>
</template>
