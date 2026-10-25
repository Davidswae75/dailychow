<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { Search, Sparkles } from "@lucide/vue";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Button from "@/components/ui/button/Button.vue";
import DishThumb from "../dish/DishThumb.vue";
import { useMealsStore, usePickStore } from "@/store";
import { useScreenSize } from "@/composables/index.ts";
import {
  allowedDishes,
  recommendDishes,
  formatLongDate,
  dishFactsShort,
  labelOf,
  mealOptions,
  type Dish,
  type MealTime,
} from "@/lib";

/** Bottom sheet (side panel on desktop) to fill one planner slot, or swap the dish planned in it. */
const props = defineProps<{ date: Date; slot: MealTime; replacing?: Dish | null }>();
const open = defineModel<boolean>("open", { default: false });

const meals = useMealsStore();
const { taste, history } = storeToRefs(meals);
const { answers } = storeToRefs(usePickStore());
const { smallerThan } = useScreenSize();

const query = ref("");
const chosen = ref<Dish | null>(null);
const saving = ref(false);

watch(open, (isOpen) => {
  if (isOpen) {
    query.value = "";
    chosen.value = null;
  }
});

const slotLabel = computed(() => labelOf(mealOptions, props.slot));

/** Favourites first; a search looks through every dish the user can eat. */
const choices = computed(() => {
  const allowed = allowedDishes(taste.value).filter((d) => d.id !== props.replacing?.id);
  const q = query.value.trim().toLowerCase();
  if (q) {
    return allowed.filter((d) =>
      [d.name, d.category, ...d.ingredients].some((text) =>
        text.toLowerCase().includes(q)
      )
    );
  }
  const favourites = allowed.filter((d) =>
    taste.value.favourites.includes(d.id)
  );
  return (favourites.length ? favourites : allowed).slice(0, 6);
});

async function save(dish: Dish) {
  saving.value = true;
  try {
    await meals.planMeal(props.date, props.slot, dish.id);
    open.value = false;
  } finally {
    saving.value = false;
  }
}

function letUsPick() {
  const best = recommendDishes(
    { ...answers.value, meal: props.slot },
    taste.value,
    history.value.map((e) => e.log),
    props.date
  ).find((r) => r.dish.id !== props.replacing?.id);
  if (best) save(best.dish);
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent
      :side="smallerThan('md') ? 'bottom' : 'right'"
      class="max-h-[88dvh] gap-0 rounded-t-[34px] bg-cream md:max-h-none md:min-w-[28rem] md:rounded-none"
    >
      <SheetHeader class="px-5 pt-6 pb-3">
        <SheetDescription class="text-sm font-bold text-terracotta-deep">{{
          formatLongDate(date)
        }}</SheetDescription>
        <SheetTitle class="font-display text-2xl"
          >{{ replacing ? "Swap" : "Add" }} {{ slotLabel.toLowerCase() }}</SheetTitle
        >
        <p v-if="replacing" class="text-sm text-ink">
          Replacing {{ replacing.name }}
        </p>
      </SheetHeader>

      <div class="flex flex-col gap-4 overflow-y-auto px-5 pb-6">
        <button
          type="button"
          class="flex items-center gap-3 rounded-[22px] bg-terracotta-deep p-3.5 text-left text-paper transition-transform active:scale-[0.98] disabled:opacity-60"
          :disabled="saving"
          @click="letUsPick"
        >
          <span
            class="grid size-11 shrink-0 place-items-center rounded-full bg-saffron text-charcoal"
          >
            <Sparkles class="size-5" />
          </span>
          <span class="flex flex-col">
            <span class="font-bold">Let Daily Chow pick</span>
            <span class="text-[13px]"
              >Uses your preferences and this week's balance</span
            >
          </span>
        </button>

        <label class="relative block">
          <span class="sr-only">Find a dish</span>
          <input
            v-model="query"
            type="search"
            placeholder="Or find a dish"
            class="h-12 w-full rounded-full border border-line bg-paper px-5 pr-12 text-base outline-0 placeholder:text-sm placeholder:text-ink focus:ring-2 focus:ring-terracotta"
          />
          <Search
            class="absolute top-3.5 right-5 size-5 text-ink"
            aria-hidden="true"
          />
        </label>

        <p class="text-sm font-semibold">
          {{ query ? "Matches" : "Your favourites" }}
        </p>
        <div
          role="radiogroup"
          aria-label="Choose a dish"
          class="flex flex-col gap-1.5"
        >
          <button
            v-for="dish in choices"
            :key="dish.id"
            type="button"
            role="radio"
            :aria-checked="chosen?.id === dish.id"
            class="flex items-center gap-3 rounded-[20px] border-2 bg-paper p-2 pr-3 text-left transition-colors"
            :class="
              chosen?.id === dish.id
                ? 'border-terracotta-deep'
                : 'border-line hover:border-ink/40'
            "
            @click="chosen = dish"
          >
            <DishThumb :dish="dish" class="size-11 rounded-xl" />
            <span class="flex grow flex-col">
              <span class="text-[15px] font-semibold">{{ dish.name }}</span>
              <span class="text-[13px] text-ink">{{
                dishFactsShort(dish)
              }}</span>
            </span>
            <span
              class="size-5 shrink-0 rounded-full"
              :class="
                chosen?.id === dish.id
                  ? 'border-[6px] border-terracotta-deep'
                  : 'border-2 border-ink'
              "
            />
          </button>
          <p v-if="!choices.length" class="py-6 text-center text-sm text-ink">
            No dish matches that.
          </p>
        </div>

        <Button
          variant="deep"
          size="xl"
          block="full"
          :disabled="!chosen"
          :loading="saving"
          @click="chosen && save(chosen)"
        >
          {{ chosen ? `Add ${chosen.name}` : "Choose a dish" }}
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
