/** Small date helpers. Everything works in the user's local time. */

const DAY_MS = 24 * 60 * 60 * 1000;

/** YYYY-MM-DD in local time; used as the key for planned days. */
export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Monday of the week that contains `date`. */
export function startOfWeek(date: Date = new Date()): Date {
  const day = startOfDay(date);
  const offset = (day.getDay() + 6) % 7; // Monday = 0
  return addDays(day, -offset);
}

/** The seven days starting at `start`. */
export function weekDays(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

/** Whole days from `date` until today (0 = today, 1 = yesterday). */
export function daysAgo(date: Date, today: Date = new Date()): number {
  return Math.round((startOfDay(today).getTime() - startOfDay(date).getTime()) / DAY_MS);
}

/** "Today", "Yesterday", a weekday for this week, else "12 Oct". */
export function relativeDayLabel(date: Date, today: Date = new Date()): string {
  const diff = daysAgo(date, today);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff > 1 && diff < 7) return date.toLocaleDateString("en-GB", { weekday: "long" });
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit", hour12: true });

export const formatLongDate = (date: Date) =>
  date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

export const shortWeekday = (date: Date) =>
  date.toLocaleDateString("en-GB", { weekday: "short" });

/** "12 – 18 Oct" for a week starting at `start`. */
export function weekRangeLabel(start: Date): string {
  const end = addDays(start, 6);
  const month = (d: Date) => d.toLocaleDateString("en-GB", { month: "short" });
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()} – ${end.getDate()} ${month(end)}`
    : `${start.getDate()} ${month(start)} – ${end.getDate()} ${month(end)}`;
}

/** "Good morning" / "Good afternoon" / "Good evening" */
export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/** The meal slot that fits the current time of day. */
export function currentMealSlot(date: Date = new Date()) {
  const h = date.getHours();
  if (h < 11) return "breakfast" as const;
  if (h < 16) return "lunch" as const;
  return "dinner" as const;
}
