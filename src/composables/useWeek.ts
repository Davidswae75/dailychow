import { computed, ref } from "vue";
import { addDays, isSameDay, startOfDay, startOfWeek, weekDays, weekRangeLabel } from "@/lib";

/** A Monday-to-Sunday week the user can step through. Starts on the current week. */
export function useWeek(initial: Date = new Date()) {
  const start = ref(startOfWeek(initial));
  const today = startOfDay(new Date());

  const days = computed(() => weekDays(start.value));
  const label = computed(() => weekRangeLabel(start.value));
  const isCurrentWeek = computed(() => days.value.some((d) => isSameDay(d, today)));

  const previous = () => (start.value = addDays(start.value, -7));
  const next = () => (start.value = addDays(start.value, 7));
  const reset = () => (start.value = startOfWeek(new Date()));

  const isToday = (date: Date) => isSameDay(date, today);
  const isPast = (date: Date) => startOfDay(date) < today;

  return { start, days, label, isCurrentWeek, previous, next, reset, isToday, isPast };
}
