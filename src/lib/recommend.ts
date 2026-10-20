/**
 * The pick engine: pure functions, no Vue or Firebase, so it can be tested on its own.
 * Hard rules (no-go foods, pepper, dislikes) remove dishes; tonight's answers and
 * recent history decide the order and the "why this one" reasons.
 */
import { dishes as allDishes, type BodyType, type Dish, type MealTime, type PriceBand } from "./dishes";
import { maxSpiceFor, type CookAnswer, type MoodAnswer, type TimeAnswer } from "./options";
import { daysAgo, relativeDayLabel } from "./dates";
import type { MealLog } from "@/types/MealTypes";

export interface PickAnswers {
  meal: MealTime;
  time: TimeAnswer;
  budget: PriceBand;
  cook: CookAnswer;
  mood: MoodAnswer;
}

/** The parts of the user's profile that shape picks. */
export interface TasteProfile {
  dietaryNeeds: string[];
  pepperLevel: string;
  bodyType: BodyType | null;
  favourites: string[];
  dislikes: string[];
}

export interface Recommendation {
  dish: Dish;
  score: number;
  reasons: string[];
}


/** Dishes the user can eat at all: no-go foods, pepper ceiling and dislikes. */
export function allowedDishes(taste: TasteProfile, dishes: Dish[] = allDishes): Dish[] {
  const maxSpice = maxSpiceFor[taste.pepperLevel] ?? 5;
  const needs = taste.dietaryNeeds;
  return dishes.filter((d) => {
    if (taste.dislikes.includes(d.id)) return false;
    if (d.spice > maxSpice) return false;
    if (needs.includes("vegetarian") && !d.vegetarian) return false;
    if (needs.includes("no_seafood") && d.seafood) return false;
    if (needs.includes("peanut_allergy") && d.peanut) return false;
    // Dishes don't carry pork or dairy flags yet, so those needs can't filter here.
    return true;
  });
}

/** When each dish and each category was last eaten. */
function lastEaten(history: MealLog[], dishes: Dish[]) {
  const byDish = new Map<string, Date>();
  const byCategory = new Map<string, Date>();
  for (const log of history) {
    const at = new Date(log.eatenAt);
    const dish = dishes.find((d) => d.id === log.dishId);
    if (!byDish.has(log.dishId) || at > byDish.get(log.dishId)!) byDish.set(log.dishId, at);
    if (dish && (!byCategory.has(dish.category) || at > byCategory.get(dish.category)!)) {
      byCategory.set(dish.category, at);
    }
  }
  return { byDish, byCategory };
}

/** Ranks every allowed dish for tonight's answers, best first. */
export function recommendDishes(
  answers: PickAnswers,
  taste: TasteProfile,
  history: MealLog[] = [],
  now: Date = new Date(),
  dishes: Dish[] = allDishes
): Recommendation[] {
  return matchDishes(answers, taste, history, now, dishes).ranked;
}

/** The answers that can be loosened when nothing matches them all, least important first. */
export type RelaxedAnswer = "mood" | "time" | "cook" | "meal";

export interface PickMatch {
  ranked: Recommendation[];
  /** Answers that had to be ignored to find anything; empty when every answer is met. */
  relaxed: RelaxedAnswer[];
}

/**
 * Tonight's answers are hard filters: every dish returned fits the meal, the time,
 * cook-or-buy and the mood. If nothing fits them all, the least important answers
 * are dropped one at a time and reported in `relaxed`.
 */
export function matchDishes(
  answers: PickAnswers,
  taste: TasteProfile,
  history: MealLog[] = [],
  now: Date = new Date(),
  dishes: Dish[] = allDishes
): PickMatch {
  const allowed = allowedDishes(taste, dishes);
  const maxMinutes = answers.time === "60" ? Infinity : Number(answers.time);

  const fits: Record<RelaxedAnswer, (d: Dish) => boolean> = {
    meal: (d) => d.mealTimes.includes(answers.meal),
    cook: (d) => answers.cook !== "buy" || d.buyFriendly,
    // Buying ready food doesn't take cooking time
    time: (d) =>
      d.minutes <= maxMinutes || (answers.cook === "buy" && d.buyFriendly) || (answers.cook === "either" && d.buyFriendly),
    mood: (d) => d.goals.includes(answers.mood),
  };

  const order: RelaxedAnswer[] = ["mood", "time", "cook", "meal"];
  let pool: Dish[] = [];
  let relaxed: RelaxedAnswer[] = [];
  for (let i = 0; i <= order.length; i++) {
    const active = order.slice(i);
    pool = allowed.filter((d) => active.every((key) => fits[key](d)));
    relaxed = order.slice(0, i);
    if (pool.length) break;
  }

  return { ranked: rank(pool, answers, taste, history, now, dishes, maxMinutes), relaxed };
}

function rank(
  pool: Dish[],
  answers: PickAnswers,
  taste: TasteProfile,
  history: MealLog[],
  now: Date,
  dishes: Dish[],
  maxMinutes: number
): Recommendation[] {
  const { byDish, byCategory } = lastEaten(history, dishes);

  const ranked = pool.map((dish) => {
    let score = 0;
    const reasons: string[] = [];

    if (dish.minutes <= maxMinutes) {
      score += 3;
      if (maxMinutes !== Infinity) reasons.push(`it fits your ${answers.time} minutes`);
    }

    if (answers.cook === "buy") {
      if (dish.buyFriendly) {
        score += 2;
        reasons.push("it's easy to buy");
      }
    }

    if (dish.goals.includes(answers.mood)) {
      score += 3;
      reasons.push(answers.mood === "comfort" ? "it's comfort food" : `it suits a ${answers.mood} mood`);
    }

    if (taste.favourites.includes(dish.id)) {
      score += 2;
      reasons.push("it's one of your favourites");
    }

    if (taste.bodyType && dish.bodyTypes.includes(taste.bodyType)) score += 1;

    // Variety: push away from what was just eaten, reward a category not had for a while
    const dishAt = byDish.get(dish.id);
    if (dishAt && daysAgo(dishAt, now) <= 2) score -= 6;
    const categoryAt = byCategory.get(dish.category);
    if (categoryAt) {
      const gap = daysAgo(categoryAt, now);
      if (gap <= 1) score -= 2;
      else if (gap >= 3) {
        score += 1;
        reasons.push(`you haven't had ${dish.category} since ${relativeDayLabel(categoryAt, now)}`);
      }
    }

    return { dish, score, reasons };
  });

  return ranked.sort((a, b) => b.score - a.score || a.dish.minutes - b.dish.minutes);
}

/** Allowed dishes not eaten in `days` days, favourites first. */
export function notEatenRecently(
  taste: TasteProfile,
  history: MealLog[],
  days = 7,
  now: Date = new Date()
): Dish[] {
  const { byDish } = lastEaten(history, allDishes);
  return allowedDishes(taste)
    .filter((d) => {
      const at = byDish.get(d.id);
      return !at || daysAgo(at, now) >= days;
    })
    .sort((a, b) => Number(taste.favourites.includes(b.id)) - Number(taste.favourites.includes(a.id)));
}
