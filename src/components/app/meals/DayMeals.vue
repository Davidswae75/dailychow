<script setup lang="ts">
import { ref } from "vue";
import { CircleCheck, Ellipsis, Repeat, Trash2 } from "@lucide/vue";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MealRow from "./MealRow.vue";
import AddMealSheet from "./AddMealSheet.vue";
import { useDayMeals } from "@/composables/useDayMeals.ts";
import { useMealsStore } from "@/store";
import { type Dish, type MealTime, isSameDay } from "@/lib";
import { useToast } from "vue-toastification";

/** A day's meal slots with eaten/planned state, plus the sheet to fill an empty one. */
const props = withDefaults(defineProps<{ date: Date; slots?: MealTime[] }>(), {
  slots: () => ["breakfast", "lunch", "dinner"],
});

const meals = useMealsStore();
const rows = useDayMeals(() => props.date, props.slots);

const sheetOpen = ref(false);
const sheetSlot = ref<MealTime>("lunch");
const sheetReplacing = ref<Dish | null>(null);
const toast = useToast();

/** Logging today uses the current time; another day keeps that day's date. */
async function markEaten(dish: Dish, slot: MealTime) {
  try {
    await meals.logMeal(dish.id, slot, isSameDay(props.date, new Date()) ? new Date() : props.date);
    toast.success(`${dish.name} marked as eaten.`);
  } catch {
    // The meals store already shows the error toast
  }
}

/** Opens the sheet for an empty slot, or with `replacing` to swap a planned dish for another. */
function openSheet(slot: MealTime, replacing: Dish | null = null) {
  sheetSlot.value = slot;
  sheetReplacing.value = replacing;
  sheetOpen.value = true;
}

/** Only planned (not yet eaten) meals can be removed; the slot goes back to empty. */
async function removePlanned(dish: Dish, slot: MealTime) {
  try {
    await meals.planMeal(props.date, slot, null);
    toast.info(`${dish.name} removed from your plan.`);
  } catch {
    // The meals store already shows the error toast
  }
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
        <div v-else-if="row.status === 'planned' && row.dish" class="flex shrink-0 items-center gap-1">
          <button
            type="button"
            class="h-9 rounded-full border border-border px-3 text-xs font-semibold transition-colors hover:border-olive hover:text-olive"
            @click="markEaten(row.dish, row.slot)"
          >
            Mark eaten
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              class="grid size-9 place-items-center rounded-full text-ink transition-colors outline-none hover:bg-muted hover:text-charcoal focus-visible:ring-2 focus-visible:ring-terracotta-deep"
              :aria-label="`More options for ${row.dish.name}`"
            >
              <Ellipsis class="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" :side-offset="6" class="w-52 rounded-[20px] border-border bg-paper p-1.5 shadow-lift">
              <DropdownMenuItem class="rounded-xl px-2.5 py-2.5" @select="openSheet(row.slot, row.dish)">
                <Repeat /> Swap for another dish
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" class="rounded-xl px-2.5 py-2.5" @select="removePlanned(row.dish, row.slot)">
                <Trash2 /> Remove from plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </template>
    </MealRow>

    <AddMealSheet v-model:open="sheetOpen" :date="date" :slot="sheetSlot" :replacing="sheetReplacing" />
  </div>
</template>
