<script setup lang="ts">
import { computed } from "vue";
import { CircleCheck, Plus, X } from "@lucide/vue";
import DishThumb from "../dish/DishThumb.vue";
import { dayMeals } from "@/hooks/useDayMeals";
import { useMealsStore } from "@/store";
import { shortWeekday } from "@/lib/dates";
import { labelOf, mealOptions } from "@/lib/options";
import type { MealTime } from "@/lib/dishes";

/** The week as a slots-by-days grid (desktop). Emits `add` for an empty cell. */
const props = defineProps<{
  days: Date[];
  slots: MealTime[];
  isToday: (date: Date) => boolean;
  isPast: (date: Date) => boolean;
}>();
defineEmits<{ add: [date: Date, slot: MealTime] }>();

const meals = useMealsStore();

/** columns[dayIndex][slotIndex] */
const columns = computed(() => props.days.map((date) => dayMeals(date, props.slots)));
</script>

<template>
  <div class="grain overflow-x-auto rounded-[30px] border border-border bg-paper p-4">
    <div class="grid min-w-[56rem] grid-cols-[5.5rem_repeat(7,minmax(0,1fr))] gap-2">
      <span />
      <div
        v-for="date in days"
        :key="date.toISOString()"
        class="flex flex-col items-center rounded-2xl py-2"
        :class="isToday(date) ? 'bg-terracotta-deep text-paper' : 'text-charcoal'"
      >
        <span class="text-xs font-semibold">{{ shortWeekday(date) }}</span>
        <span class="font-display text-xl font-bold">{{ date.getDate() }}</span>
      </div>

      <template v-for="(slot, s) in slots" :key="slot">
        <span class="flex items-center text-sm font-bold text-ink">{{ labelOf(mealOptions, slot) }}</span>

        <template v-for="(day, d) in columns" :key="`${slot}-${d}`">
          <div
            v-if="day[s].dish"
            class="group relative flex min-h-28 flex-col gap-1.5 rounded-[18px] bg-cream p-1.5 transition-opacity"
            :class="[isPast(days[d]) && 'opacity-60', isToday(days[d]) && 'outline-2 -outline-offset-2 outline-terracotta-deep']"
          >
            <RouterLink :to="`/dashboard/foods/${day[s].dish!.id}`" class="flex flex-col gap-1.5">
              <DishThumb :dish="day[s].dish!" class="h-16 w-full rounded-xl" />
              <span class="px-0.5 text-[13px] leading-tight font-semibold">{{ day[s].dish!.name }}</span>
            </RouterLink>
            <CircleCheck
              v-if="day[s].status === 'eaten'"
              class="absolute top-2.5 right-2.5 size-5 rounded-full bg-paper text-olive"
              aria-label="Eaten"
            />
            <button
              v-else
              type="button"
              :aria-label="`Remove ${day[s].dish!.name}`"
              class="absolute top-2.5 right-2.5 grid size-6 place-items-center rounded-full bg-paper/90 text-charcoal opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              @click="meals.planMeal(days[d], slot, null)"
            >
              <X class="size-3.5" />
            </button>
          </div>
          <button
            v-else
            type="button"
            :aria-label="`Add ${labelOf(mealOptions, slot).toLowerCase()} on ${days[d].toDateString()}`"
            class="grid min-h-28 place-items-center rounded-[18px] border border-dashed border-ink/50 text-ink transition-colors hover:border-terracotta-deep hover:text-terracotta-deep"
            :class="isPast(days[d]) && 'opacity-50'"
            @click="$emit('add', days[d], slot)"
          >
            <Plus class="size-5" />
          </button>
        </template>
      </template>
    </div>
  </div>
</template>
