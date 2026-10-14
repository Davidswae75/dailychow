/**
 * Meals the user ate (History), meals they planned (Planner) and dishes they
 * never want suggested. Signed in, everything reads from and writes to the user
 * document; signed out (local development), it keeps the same data in memory so
 * every screen still works.
 */
import { defineStore, storeToRefs } from "pinia";
import { computed, reactive } from "vue";
import { useUserStore } from "./user";
import * as mealService from "@/firebase/services/meals";
import { getError } from "@/firebase/utils/error";
import { getDishById, type Dish, type MealTime } from "@/lib/dishes";
import { bodyTypeFromId } from "@/lib/options";
import { isSameDay, toDateKey } from "@/lib/dates";
import { recommendDishes, type PickAnswers, type TasteProfile } from "@/lib/recommend";
import type { DayPlan, MealLog, MealPlan } from "@/types";

/** A history entry together with its dish, ready for display. */
export interface MealEntry {
  log: MealLog;
  dish: Dish;
  at: Date;
}

export const useMealsStore = defineStore("meals", () => {
  const { user } = storeToRefs(useUserStore());
  const uid = computed(() => user.value?.id ?? null);

  // In-memory stand-in used only when nobody is signed in
  const local = reactive<{ foodEaten: MealLog[]; plan: MealPlan; dislikes: string[]; favourites: string[] }>({
    foodEaten: [],
    plan: {},
    dislikes: [],
    favourites: [],
  });

  const rawHistory = computed(() => user.value?.foodEaten ?? local.foodEaten);
  const plan = computed<MealPlan>(() => user.value?.plan ?? local.plan);
  const dislikes = computed(() => user.value?.dislikes ?? local.dislikes);
  const favourites = computed(() => (user.value ? (user.value.favourites ?? []).map((d) => d.id) : local.favourites));

  /** Everything eaten, newest first, with dishes resolved. */
  const history = computed<MealEntry[]>(() =>
    rawHistory.value
      .map((log) => ({ log, dish: getDishById(log.dishId), at: new Date(log.eatenAt) }))
      .filter((e): e is MealEntry => e.dish !== null)
      .sort((a, b) => b.at.getTime() - a.at.getTime())
  );

  /** What the pick engine needs to know about this user. */
  const taste = computed<TasteProfile>(() => ({
    dietaryNeeds: user.value?.notInterested?.dietaryNeeds ?? [],
    pepperLevel: user.value?.notInterested?.pepperLevel ?? "medium",
    bodyType: bodyTypeFromId[user.value?.bodyType?.id ?? ""] ?? null,
    favourites: favourites.value,
    dislikes: dislikes.value,
  }));

  const mealsOn = (date: Date) => history.value.filter((e) => isSameDay(e.at, date));
  const plannedOn = (date: Date): DayPlan => plan.value[toDateKey(date)] ?? {};

  /** Runs a write against Firestore when signed in, otherwise against local state. */
  async function write(remote: (id: string) => Promise<void>, offline: () => void) {
    if (!uid.value) return offline();
    try {
      await remote(uid.value);
    } catch (error) {
      getError(error);
      throw error;
    }
  }

  function logMeal(dishId: string, slot: MealTime, at: Date = new Date()) {
    const meal: MealLog = { id: crypto.randomUUID(), dishId, slot, eatenAt: at.toISOString() };
    return write(
      (id) => mealService.logMeal(id, meal),
      () => local.foodEaten.push(meal)
    );
  }

  function removeMeal(meal: MealLog) {
    return write(
      (id) => mealService.removeMeal(id, meal),
      () => (local.foodEaten = local.foodEaten.filter((m) => m.id !== meal.id))
    );
  }

  function planMeal(date: Date, slot: MealTime, dishId: string | null) {
    const key = toDateKey(date);
    return write(
      (id) => mealService.setPlannedMeal(id, key, slot, dishId),
      () => {
        const day = { ...(local.plan[key] ?? {}) };
        if (dishId) day[slot] = dishId;
        else delete day[slot];
        local.plan = { ...local.plan, [key]: day };
      }
    );
  }

  function dislike(dishId: string) {
    return write(
      (id) => mealService.addDislike(id, dishId),
      () => local.dislikes.push(dishId)
    );
  }

  function undoDislike(dishId: string) {
    return write(
      (id) => mealService.removeDislike(id, dishId),
      () => (local.dislikes = local.dislikes.filter((d) => d !== dishId))
    );
  }

  /** Adds or removes a dish from favourites (stored as dish objects on the user, as onboarding saves them). */
  function toggleFavourite(dish: Dish) {
    const isFavourite = favourites.value.includes(dish.id);
    return write(
      (id) => {
        const current = user.value?.favourites ?? [];
        const next = isFavourite ? current.filter((d) => d.id !== dish.id) : [...current, dish];
        return mealService.updatePreferences(id, { favourites: next });
      },
      () =>
        (local.favourites = isFavourite
          ? local.favourites.filter((d) => d !== dish.id)
          : [...local.favourites, dish.id])
    );
  }

  /**
   * Plans a dish for every empty slot on the given days, avoiding repeats
   * within the run. Returns how many slots were filled.
   */
  async function fillEmptySlots(days: Date[], slots: MealTime[], answers: PickAnswers) {
    const used = new Set<string>();
    const logs = history.value.map((e) => e.log);
    let filled = 0;
    for (const date of days) {
      const planned = plannedOn(date);
      const eaten = mealsOn(date);
      for (const slot of slots) {
        if (planned[slot] || eaten.some((e) => e.log.slot === slot)) continue;
        const best = recommendDishes({ ...answers, meal: slot }, taste.value, logs, date).find(
          (r) => !used.has(r.dish.id)
        );
        if (!best) continue;
        used.add(best.dish.id);
        await planMeal(date, slot, best.dish.id);
        filled += 1;
      }
    }
    return filled;
  }

  return {
    history,
    favourites,
    fillEmptySlots,
    toggleFavourite,
    plan,
    dislikes,
    taste,
    mealsOn,
    plannedOn,
    logMeal,
    removeMeal,
    planMeal,
    dislike,
    undoDislike,
  };
});
