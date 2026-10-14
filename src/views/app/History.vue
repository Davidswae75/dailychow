<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { CalendarPlus, Trash2 } from "@lucide/vue";
import PageHeader from "@/components/app/common/PageHeader.vue";
import StatTile from "@/components/app/common/StatTile.vue";
import OptionGroup from "@/components/app/common/OptionGroup.vue";
import MealRow from "@/components/app/meals/MealRow.vue";
import PlanDishSheet from "@/components/app/meals/PlanDishSheet.vue";
import { useMealsStore, type MealEntry } from "@/store";
import { useToast } from "vue-toastification";
import { formatTime, relativeDayLabel } from "@/lib/dates";
import { labelOf, mealOptions, type Option } from "@/lib/options";
import type { Dish } from "@/lib/dishes";

const meals = useMealsStore();
const { history } = storeToRefs(meals);
const toast = useToast();

const filterOptions: Option[] = [{ label: "All", value: "all" }, ...mealOptions];
const filter = ref("all");

const now = new Date();
const thisMonth = computed(() =>
  history.value.filter((e) => e.at.getMonth() === now.getMonth() && e.at.getFullYear() === now.getFullYear())
);
const topCategory = computed(() => {
  const counts = new Map<string, number>();
  thisMonth.value.forEach((e) => counts.set(e.dish.category, (counts.get(e.dish.category) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
});

/** Filtered history grouped under "Today", "Yesterday", weekday or date. */
const groups = computed(() => {
  const list = history.value.filter((e) => filter.value === "all" || e.log.slot === filter.value);
  const byDay = new Map<string, MealEntry[]>();
  list.forEach((e) => {
    const label = relativeDayLabel(e.at, now);
    byDay.set(label, [...(byDay.get(label) ?? []), e]);
  });
  return [...byDay.entries()].map(([day, items]) => ({ day, items }));
});

const planDish = ref<Dish | null>(null);
const planOpen = ref(false);
function planAgain(dish: Dish) {
  planDish.value = dish;
  planOpen.value = true;
}

async function remove(entry: MealEntry) {
  await meals.removeMeal(entry.log);
  toast.info(`${entry.dish.name} removed from your history. Tap to undo.`, {
    onClick: () => meals.logMeal(entry.log.dishId, entry.log.slot, entry.at),
  });
}
</script>

<template>
  <main class="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-6 pb-32 md:px-8 md:pb-10">
    <PageHeader title="What you've eaten" />

    <div class="grid grid-cols-3 gap-2">
      <StatTile :value="thisMonth.length" label="meals this month" />
      <StatTile :value="new Set(thisMonth.map((e) => e.dish.id)).size" label="different dishes" />
      <StatTile :value="topCategory" label="most eaten" highlight />
    </div>

    <OptionGroup v-model="filter" label="Show" :options="filterOptions" />

    <section v-for="group in groups" :key="group.day" class="flex flex-col gap-2" :aria-label="group.day">
      <h2 class="text-[13px] font-bold tracking-wide text-ink uppercase">{{ group.day }}</h2>
      <MealRow
        v-for="entry in group.items"
        :key="entry.log.id"
        :label="labelOf(mealOptions, entry.log.slot)"
        :dish="entry.dish"
        :meta="formatTime(entry.at)"
      >
        <template #trailing>
          <button
            type="button"
            :aria-label="`Plan ${entry.dish.name} again`"
            class="grid size-10 place-items-center rounded-full border border-border bg-cream transition-colors hover:border-terracotta-deep"
            @click="planAgain(entry.dish)"
          >
            <CalendarPlus class="size-4" />
          </button>
          <button
            type="button"
            :aria-label="`Remove ${entry.dish.name} from history`"
            class="grid size-10 place-items-center rounded-full text-ink transition-colors hover:text-destructive"
            @click="remove(entry)"
          >
            <Trash2 class="size-4" />
          </button>
        </template>
      </MealRow>
    </section>

    <div v-if="!groups.length" class="grain rounded-[26px] border border-border bg-paper px-6 py-12 text-center">
      <p class="font-display text-xl font-bold">Nothing here yet</p>
      <p class="mt-1 text-sm text-ink">Tap “I'll have this” on tonight's pick and it shows up here.</p>
      <RouterLink to="/dashboard/pick" class="mt-4 inline-flex font-semibold text-terracotta-deep underline">
        Get tonight's pick
      </RouterLink>
    </div>

    <PlanDishSheet v-if="planDish" v-model:open="planOpen" :dish="planDish" />
  </main>
</template>
