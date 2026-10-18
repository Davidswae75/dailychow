<script setup lang="ts">
import { ref } from "vue";
import { CircleCheck } from "@lucide/vue";
import MealRow from "./MealRow.vue";
import AddMealSheet from "./AddMealSheet.vue";
import { useDayMeals } from "@/composables/useDayMeals.ts";
import { useMealsStore } from "@/store";
import { type MealTime, isSameDay } from "@/lib";

/** A day's meal slots with eaten/planned state, plus the sheet to fill an empty one. */
const props = withDefaults(defineProps<{ date: Date; slots?: MealTime[] }>(), {
  slots: () => ["breakfast", "lunch", "dinner"],
});

const meals = useMealsStore();
const rows = useDayMeals(() => props.date, props.slots);

const sheetOpen = ref(false);
const sheetSlot = ref<MealTime>("lunch");

/** Logging today uses the current time; another day keeps that day's date. */
const markEaten = (dishId: string, slot: MealTime) =>
  meals.logMeal(dishId, slot, isSameDay(props.date, new Date()) ? new Date() : props.date);

function openSheet(slot: MealTime) {
  sheetSlot.value = slot;
  sheetOpen.value = true;
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <MealRow
      v-for="row in rows"
      :key="row.slot"
      :label="row.label"
      :dish="row.dish"
      @add="openSheet(row.slot)"
    >
      <template #trailing>
        <span
          v-if="row.status === 'eaten'"
          class="inline-flex items-center gap-1 text-xs font-semibold text-olive"
        >
          <CircleCheck class="size-4" /> Eaten
        </span>
        <button
          v-else-if="row.status === 'planned' && row.dish"
          type="button"
          class="h-9 rounded-full border border-border px-3 text-xs font-semibold transition-colors hover:border-olive hover:text-olive"
          @click="markEaten(row.dish.id, row.slot)"
        >
          Mark eaten
        </button>
      </template>
    </MealRow>

    <AddMealSheet v-model:open="sheetOpen" :date="date" :slot="sheetSlot" />
  </div>
</template>
