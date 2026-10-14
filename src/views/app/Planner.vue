<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { ChevronLeft, ChevronRight, ShoppingBasket, Sparkles } from "@lucide/vue";
import PageHeader from "@/components/app/common/PageHeader.vue";
import SurfaceCard from "@/components/app/common/SurfaceCard.vue";
import PlannerGrid from "@/components/app/meals/PlannerGrid.vue";
import WeekStrip from "@/components/app/meals/WeekStrip.vue";
import DayMeals from "@/components/app/meals/DayMeals.vue";
import AddMealSheet from "@/components/app/meals/AddMealSheet.vue";
import ShoppingListSheet from "@/components/app/meals/ShoppingListSheet.vue";
import Button from "@/components/ui/button/Button.vue";
import { useMealsStore, usePickStore } from "@/store";
import { useWeek } from "@/hooks";
import { useToast } from "vue-toastification";
import { dayMeals } from "@/hooks/useDayMeals";
import { formatLongDate, isSameDay, toDateKey } from "@/lib/dates";
import type { MealTime } from "@/lib/dishes";

const SLOTS: MealTime[] = ["breakfast", "lunch", "dinner", "snack"];

const meals = useMealsStore();
const { answers } = storeToRefs(usePickStore());
const toast = useToast();
const week = useWeek();
const { days, label } = week;

// Mobile shows one day at a time
const selectedDay = ref(new Date());
watch(days, (list) => {
  if (!list.some((d) => isSameDay(d, selectedDay.value))) selectedDay.value = list.find(week.isToday) ?? list[0];
});
const dayTiles = computed(() =>
  days.value.map((date) => ({
    date,
    isToday: week.isToday(date),
    count: dayMeals(date, SLOTS).filter((m) => m.dish).length,
  }))
);

// Add-meal sheet for a grid cell
const sheet = ref<{ open: boolean; date: Date; slot: MealTime }>({ open: false, date: new Date(), slot: "lunch" });
const openSheet = (date: Date, slot: MealTime) => (sheet.value = { open: true, date, slot });

const shoppingOpen = ref(false);
const filling = ref(false);

/** Open slots from today onward, for the week on screen. */
const upcomingDays = computed(() => days.value.filter((d) => !week.isPast(d)));

const balanceNote = computed(() => {
  const planned = days.value.flatMap((d) => dayMeals(d, SLOTS)).filter((m) => m.dish);
  if (!planned.length) return "Nothing planned yet. Fill the week in one tap, then tweak what you don't fancy.";
  const counts = new Map<string, number>();
  planned.forEach((m) => counts.set(m.dish!.category, (counts.get(m.dish!.category) ?? 0) + 1));
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([c]) => c);
  const open = upcomingDays.value.length * SLOTS.length - upcomingDays.value.flatMap((d) => dayMeals(d, SLOTS)).filter((m) => m.dish).length;
  return `${top.join(" and ")} carry most of this week${open ? `, with ${open} open slots left` : ""}.`;
});

async function fillWeek() {
  filling.value = true;
  try {
    const count = await meals.fillEmptySlots(upcomingDays.value, ["breakfast", "lunch", "dinner"], answers.value);
    toast.success(count ? `Planned ${count} meals for you.` : "Every meal this week is already planned.");
  } finally {
    filling.value = false;
  }
}
</script>

<template>
  <main class="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 pb-32 md:px-8 md:pb-10">
    <PageHeader title="This week's plate">
      <template #actions>
        <Button variant="outline" size="lg" class="gap-2 bg-paper" @click="shoppingOpen = true">
          <ShoppingBasket class="size-4" /> Shopping list
        </Button>
        <Button
          size="lg"
          variant="deep"
          class="gap-2"
          :loading="filling"
          :disabled="!upcomingDays.length"
          @click="fillWeek"
        >
          <Sparkles class="size-4" /> Fill empty slots for me
        </Button>
      </template>
    </PageHeader>

    <div class="-mt-2 flex items-center gap-1">
      <button type="button" aria-label="Previous week" class="grid size-10 place-items-center rounded-full border border-border bg-paper" @click="week.previous">
        <ChevronLeft class="size-4" />
      </button>
      <span class="min-w-32 text-center font-semibold">{{ label }}</span>
      <button type="button" aria-label="Next week" class="grid size-10 place-items-center rounded-full border border-border bg-paper" @click="week.next">
        <ChevronRight class="size-4" />
      </button>
      <button
        v-if="!week.isCurrentWeek.value"
        type="button"
        class="ml-2 text-sm font-semibold text-terracotta-deep underline-offset-4 hover:underline"
        @click="week.reset"
      >
        This week
      </button>
    </div>

    <!-- Desktop: the whole week -->
    <PlannerGrid
      class="hidden md:block"
      :days="days"
      :slots="SLOTS"
      :is-today="week.isToday"
      :is-past="week.isPast"
      @add="openSheet"
    />

    <!-- Mobile: pick a day, see its meals -->
    <div class="flex flex-col gap-4 md:hidden">
      <WeekStrip :days="dayTiles" :selected-key="toDateKey(selectedDay)" @select="(d) => (selectedDay = d)" />
      <SurfaceCard class="flex flex-col gap-3">
        <h2 class="text-lg font-bold">{{ formatLongDate(selectedDay) }}</h2>
        <DayMeals :date="selectedDay" :slots="SLOTS" />
      </SurfaceCard>
    </div>

    <p class="grain rounded-[22px] border border-border bg-paper px-4 py-3.5 text-sm text-ink first-letter:uppercase">
      {{ balanceNote }}
    </p>

    <AddMealSheet v-model:open="sheet.open" :date="sheet.date" :slot="sheet.slot" />
    <ShoppingListSheet v-model:open="shoppingOpen" :days="upcomingDays" :slots="SLOTS" />
  </main>
</template>
