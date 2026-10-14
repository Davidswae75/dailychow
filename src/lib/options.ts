/**
 * Every list of choices the app shows (onboarding, Pick, Preferences) lives here,
 * so labels and stored values stay identical everywhere.
 */
import type { BodyType, MealGoal, MealTime, PriceBand } from "./dishes";

export interface Option<V extends string = string> {
  label: string;
  value: V;
  /** Optional second line, e.g. a body-type explanation */
  note?: string;
}

/** Find an option's label by value, falling back to the raw value. */
export const labelOf = <V extends string>(options: readonly Option<V>[], value?: V | string | null) =>
  options.find((o) => o.value === value)?.label ?? value ?? "";

// ---------- About you (onboarding + Preferences) ----------

export const goalOptions: Option[] = [
  { label: "Eat healthier", value: "eat_healthier" },
  { label: "Lose weight", value: "lose_weight" },
  { label: "Maintain my weight", value: "maintain_my_weight" },
  { label: "Gain weight", value: "gain_weight" },
  { label: "Eat more Nigerian food", value: "eat_nigerian_food" },
  { label: "Spend less on food", value: "spend_less_on_food" },
];

export const dietaryOptions: Option[] = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "No pork", value: "no_pork" },
  { label: "No seafood", value: "no_seafood" },
  { label: "Peanut allergy", value: "peanut_allergy" },
  { label: "Lactose intolerant", value: "lactose_intolerant" },
];

export const pepperOptions: Option[] = [
  { label: "Mild", value: "mild" },
  { label: "Gentle", value: "gentle" },
  { label: "Medium", value: "medium" },
  { label: "Hot", value: "hot" },
  { label: "Proper pepper", value: "proper_pepper" },
];

/** Highest dish spice (1–5) each pepper level accepts. */
export const maxSpiceFor: Record<string, number> = {
  mild: 1,
  gentle: 2,
  medium: 3,
  hot: 4,
  proper_pepper: 5,
};

/** Maps the onboarding body-type ids to the body types dishes are tagged with. */
export const bodyTypeFromId: Record<string, BodyType> = {
  lean_frame: "lean",
  average_build: "average",
  curvy_build: "curvy",
  athletic_build: "athletic",
  big_build: "big",
};

// ---------- Tonight (Pick) ----------

export const mealOptions: Option<MealTime>[] = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" },
];

export type TimeAnswer = "15" | "30" | "45" | "60";
export const timeOptions: Option<TimeAnswer>[] = [
  { label: "15 mins", value: "15" },
  { label: "30 mins", value: "30" },
  { label: "45 mins", value: "45" },
  { label: "An hour+", value: "60" },
];

export const budgetOptions: Option<PriceBand>[] = [
  { label: "Under ₦1,000", value: "0-1000" },
  { label: "₦1,000–₦3,000", value: "1000-3000" },
  { label: "₦3,000–₦5,000", value: "3000-5000" },
  { label: "₦5,000+", value: "5000+" },
];

export type CookAnswer = "cook" | "buy" | "either";
export const cookOptions: Option<CookAnswer>[] = [
  { label: "Cook at home", value: "cook" },
  { label: "Buy it ready", value: "buy" },
  { label: "Either", value: "either" },
];

export type MoodAnswer = Extract<MealGoal, "lighter" | "balanced" | "energy" | "protein" | "comfort">;
export const moodOptions: Option<MoodAnswer>[] = [
  { label: "Something light", value: "lighter" },
  { label: "Balanced", value: "balanced" },
  { label: "Energy", value: "energy" },
  { label: "Protein", value: "protein" },
  { label: "Comfort food", value: "comfort" },
];
