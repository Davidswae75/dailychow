<script setup lang="ts">
import { shortWeekday, toDateKey } from "@/lib/dates";

/**
 * Seven day tiles with one dot per meal. Today is filled terracotta.
 * Pass `selectedKey` to make the days selectable (emits `select`).
 */
const props = defineProps<{
  days: { date: Date; count: number; isToday: boolean }[];
  selectedKey?: string;
}>();
defineEmits<{ select: [date: Date] }>();

const tileClass = (day: { date: Date; isToday: boolean }) => {
  const selected = props.selectedKey === toDateKey(day.date);
  if (day.isToday) return "bg-terracotta-deep text-paper";
  if (selected) return "bg-charcoal text-cream";
  return "bg-cream text-charcoal";
};
</script>

<template>
  <ol class="grid grid-cols-7 gap-1.5 md:gap-2">
    <li v-for="day in days" :key="toDateKey(day.date)">
      <component
        :is="selectedKey !== undefined ? 'button' : 'div'"
        :type="selectedKey !== undefined ? 'button' : undefined"
        :aria-pressed="selectedKey !== undefined ? selectedKey === toDateKey(day.date) : undefined"
        :aria-label="`${day.date.toDateString()}: ${day.count} meals`"
        class="flex w-full flex-col items-center gap-1.5 rounded-[18px] px-1 py-3 transition-colors"
        :class="[
          tileClass(day),
          selectedKey !== undefined && selectedKey === toDateKey(day.date) && day.isToday && 'ring-2 ring-charcoal ring-offset-2 ring-offset-paper',
        ]"
        @click="selectedKey !== undefined && $emit('select', day.date)"
      >
        <span class="text-xs font-semibold">{{ shortWeekday(day.date) }}</span>
        <span class="font-display text-xl font-bold leading-none">{{ day.date.getDate() }}</span>
        <span class="flex min-h-1.5 gap-0.5" aria-hidden="true">
          <span v-for="n in Math.min(day.count, 4)" :key="n" class="size-1.5 rounded-full bg-current" />
        </span>
      </component>
    </li>
  </ol>
</template>
