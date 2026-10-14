import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useMealsStore } from "@/store/meals";
import { getDishById, type Dish, type MealTime } from "@/lib/dishes";
import { labelOf, mealOptions } from "@/lib/options";
import type { MealLog } from "@/types";

export type SlotStatus = "eaten" | "planned" | "empty";

export interface SlotMeal {
  slot: MealTime;
  label: string;
  dish: Dish | null;
  status: SlotStatus;
  /** Present when the meal was logged as eaten */
  log?: MealLog;
}

export const DEFAULT_SLOTS: MealTime[] = ["breakfast", "lunch", "dinner"];

/**
 * Each meal slot of a day, merging what was eaten with what was planned.
 * Eaten wins over planned for the same slot. Call inside setup or a computed.
 */
export function dayMeals(date: Date, slots: MealTime[] = DEFAULT_SLOTS): SlotMeal[] {
  const meals = useMealsStore();
  const eaten = meals.mealsOn(date);
  const planned = meals.plannedOn(date);

  return slots.map((slot) => {
    const label = labelOf(mealOptions, slot);
    const ate = eaten.find((e) => e.log.slot === slot);
    if (ate) return { slot, label, dish: ate.dish, status: "eaten", log: ate.log };
    const plannedId = planned[slot];
    const plannedDish = plannedId ? getDishById(plannedId) : null;
    return plannedDish
      ? { slot, label, dish: plannedDish, status: "planned" }
      : { slot, label, dish: null, status: "empty" };
  });
}

/** Reactive version of `dayMeals` for one (possibly changing) date. */
export function useDayMeals(date: MaybeRefOrGetter<Date>, slots: MealTime[] = DEFAULT_SLOTS) {
  return computed(() => dayMeals(toValue(date), slots));
}
