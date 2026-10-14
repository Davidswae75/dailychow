import type { MealTime } from "@/lib/dishes";

/** One meal the user said they ate. Stored in the user doc's `foodEaten` array. */
export interface MealLog {
  id: string;
  dishId: string;
  slot: MealTime;
  /** ISO timestamp */
  eatenAt: string;
}

/** Dish ids planned per slot for one day. */
export type DayPlan = Partial<Record<MealTime, string>>;

/** Planned meals keyed by date (YYYY-MM-DD). Stored in the user doc's `plan` map. */
export type MealPlan = Record<string, DayPlan>;
