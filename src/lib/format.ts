/** Text formatting for dishes, shared by every screen that shows them. */
import { priceLabel, type Dish, type PriceBand } from "./dishes";
import { labelOf, pepperOptions } from "./options";

const priceShortLabel: Record<PriceBand, string> = {
  "0-1000": "under ₦1k",
  "1000-3000": "₦1–3k",
  "3000-5000": "₦3–5k",
  "5000+": "₦5k+",
};

export const formatPrice = (band: PriceBand) => priceLabel[band];
export const formatPriceShort = (band: PriceBand) => priceShortLabel[band];
export const formatMinutes = (minutes: number) => `${minutes} mins`;

/** Dish spice (1–5) as the user's pepper words. */
export const spiceLabel = (spice: number) =>
  labelOf(pepperOptions, pepperOptions[Math.min(Math.max(spice, 1), 5) - 1]?.value);

/** "Medium pepper", "Proper pepper" */
export const pepperText = (spice: number) => {
  const label = spiceLabel(spice);
  return /pepper$/i.test(label) ? label : `${label} pepper`;
};

/** "45 mins · ₦1,000–₦3,000" */
export const dishFacts = (dish: Dish) => `${formatMinutes(dish.minutes)} · ${formatPrice(dish.price)}`;

/** "45 mins · ₦1–3k" for tight spaces */
export const dishFactsShort = (dish: Dish) => `${formatMinutes(dish.minutes)} · ${formatPriceShort(dish.price)}`;

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "Because a, b and c." from a pick's reasons, or `fallback` when there are none. */
export const whyText = (reasons: string[], fallback: string) =>
  reasons.length ? `Because ${joinReasons(reasons.slice(0, 3))}.` : fallback;

/** Joins reasons into one sentence: "a, b and c". */
export function joinReasons(reasons: string[]): string {
  if (reasons.length <= 1) return reasons[0] ?? "";
  return `${reasons.slice(0, -1).join(", ")} and ${reasons[reasons.length - 1]}`;
}
