<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { RefreshCw } from "@lucide/vue";
import Reveal from "@/components/utils/Reveal.vue";
import TonightCard from "@/components/app/pick/TonightCard.vue";
import SurfaceCard from "@/components/app/common/SurfaceCard.vue";
import SectionHeader from "@/components/app/common/SectionHeader.vue";
import DayMeals from "@/components/app/meals/DayMeals.vue";
import WeekStrip from "@/components/app/meals/WeekStrip.vue";
import DishTile from "@/components/app/dish/DishTile.vue";
import { useMealsStore, usePickStore, useUserStore } from "@/store";
import { addDays, formatLongDate, greeting, isSameDay, relativeDayLabel } from "@/lib/dates";
import { labelOf, mealOptions } from "@/lib/options";
import { notEatenRecently } from "@/lib/recommend";

const { user } = storeToRefs(useUserStore());
const meals = useMealsStore();
const { history, taste } = storeToRefs(meals);
const pick = usePickStore();
const { current, answers } = storeToRefs(pick);

const today = new Date();
const firstName = computed(() => user.value?.fullName?.split(" ")[0] ?? "there");

/** The last seven days, ending today, with how many meals were logged on each. */
const lastSevenDays = computed(() =>
  Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)).map((date) => ({
    date,
    count: meals.mealsOn(date).length,
    isToday: isSameDay(date, today),
  }))
);

const weekEntries = computed(() => history.value.filter((e) => e.at >= addDays(today, -6)));

const weekSummary = computed(() => {
  if (!weekEntries.value.length) return "Nothing logged this week yet. Tap “I'll have this” on a pick to start.";
  const counts = new Map<string, number>();
  weekEntries.value.forEach((e) => counts.set(e.dish.category, (counts.get(e.dish.category) ?? 0) + 1));
  const [top] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return `Lots of ${top[0]} lately, so picks will lean towards something else.`;
});

const distinctDishes = computed(() => new Set(weekEntries.value.map((e) => e.dish.id)).size);
const recent = computed(() => history.value.slice(0, 3));
const tryAgain = computed(() => notEatenRecently(taste.value, history.value.map((e) => e.log)).slice(0, 8));
</script>

<template>
  <main class="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-6 pb-32 md:px-8 md:pb-10">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div class="space-y-1">
        <p class="text-sm text-ink">{{ formatLongDate(today) }}</p>
        <h1 class="text-3xl md:text-4xl font-bold">{{ greeting(today) }}, {{ firstName }}</h1>
      </div>
      <RouterLink
        to="/dashboard/pick"
        class="hidden h-11 items-center gap-2 rounded-full border border-border bg-paper px-5 text-[15px] font-semibold transition-colors hover:border-terracotta-deep md:inline-flex"
      >
        <RefreshCw class="size-4" /> Change tonight's answers
      </RouterLink>
    </header>

    <div class="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <Reveal :delay="0.05" :distance="16">
        <TonightCard
          v-if="current"
          :pick="current"
          :meal-label="labelOf(mealOptions, answers.meal)"
          class="h-full"
          @another="pick.pickAnother()"
        />
        <SurfaceCard v-else class="h-full">
          <p class="text-ink">No dish fits your settings right now. Try loosening your pepper level or no-go list in Preferences.</p>
        </SurfaceCard>
      </Reveal>

      <Reveal :delay="0.12" :distance="16">
        <SurfaceCard class="flex h-full flex-col gap-3">
          <SectionHeader title="Today's meals" :link="{ to: '/dashboard/planner', label: 'Planner' }" />
          <DayMeals :date="today" />
        </SurfaceCard>
      </Reveal>
    </div>

    <div class="hidden gap-4 md:grid lg:grid-cols-[2fr_1fr]">
      <Reveal :delay="0.18" :distance="16">
        <SurfaceCard class="flex h-full flex-col gap-4">
          <SectionHeader
            title="Your week so far"
            :meta="`${weekEntries.length} meals · ${distinctDishes} different dishes`"
          />
          <WeekStrip :days="lastSevenDays" />
          <p class="text-sm text-ink">{{ weekSummary }}</p>
        </SurfaceCard>
      </Reveal>

      <Reveal :delay="0.24" :distance="16">
        <SurfaceCard class="flex h-full flex-col gap-3">
          <SectionHeader title="Recently eaten" :link="{ to: '/dashboard/history', label: 'History' }" />
          <ul v-if="recent.length" class="flex flex-col gap-2.5">
            <li v-for="entry in recent" :key="entry.log.id" class="flex justify-between gap-3 text-[15px]">
              <RouterLink :to="`/dashboard/foods/${entry.dish.id}`" class="truncate hover:underline">
                {{ entry.dish.name }}
              </RouterLink>
              <span class="shrink-0 text-ink">{{ relativeDayLabel(entry.at, today) }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-ink">Meals you mark as eaten show up here.</p>
        </SurfaceCard>
      </Reveal>
    </div>

    <section v-if="tryAgain.length" aria-labelledby="try-again" class="flex flex-col gap-3">
      <h2 id="try-again" class="text-xl font-bold">You haven't had these in a while</h2>
      <div class="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
        <DishTile v-for="dish in tryAgain" :key="dish.id" :dish="dish" />
      </div>
    </section>
  </main>
</template>
