<script setup lang="ts">
import { computed, ref } from "vue";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import IngredientChecklist from "../dish/IngredientChecklist.vue";
import { dayMeals } from "@/composables/useDayMeals.ts";
import { useScreenSize } from "@/composables/index.ts";
import type { MealTime } from "@/lib";

/** Every ingredient for the planned (not yet eaten) meals on the given days. */
const props = defineProps<{ days: Date[]; slots: MealTime[] }>();
const open = defineModel<boolean>("open", { default: false });
const { smallerThan } = useScreenSize();

const plannedDishes = computed(() =>
  props.days.flatMap((date) => dayMeals(date, props.slots)).filter((m) => m.status === "planned" && m.dish)
);

const ingredients = computed(() => [...new Set(plannedDishes.value.flatMap((m) => m.dish!.ingredients))].sort());
const have = ref<string[]>([]);
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent
      :side="smallerThan('md') ? 'bottom' : 'right'"
      class="max-h-[88dvh] gap-0 rounded-t-[34px] bg-cream md:max-h-none md:min-w-[30rem] md:rounded-none"
    >
      <SheetHeader class="px-5 pt-6 pb-3">
        <SheetDescription class="text-sm font-bold text-terracotta-deep">
          {{ plannedDishes.length }} planned meals
        </SheetDescription>
        <SheetTitle class="font-display text-2xl">This week's shopping list</SheetTitle>
      </SheetHeader>
      <div class="overflow-y-auto px-5 pb-6">
        <IngredientChecklist v-if="ingredients.length" v-model="have" :ingredients="ingredients" />
        <p v-else class="py-8 text-center text-ink">Plan a few meals and their ingredients will show up here.</p>
      </div>
    </SheetContent>
  </Sheet>
</template>
