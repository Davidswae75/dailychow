<script setup lang="ts">
import { truncateText } from '@/lib';

defineProps<{
  value: string | number;
  label: string;
  /** Saffron fill for the one stat worth calling out */
  highlight?: boolean;
}>();
</script>

<template>
  <div
    class="rounded-[20px] border p-3.5"
    :class="highlight ? 'border-saffron bg-saffron text-charcoal' : 'grain border-border bg-paper'"
  >
    <p class="font-display text-2xl font-bold leading-tight capitalize line-clamp-1">{{ truncateText(String(value), 5) }}</p>
    <p class="text-xs" :class="highlight ? 'text-charcoal' : 'text-ink'">{{ label }}</p>
  </div>
</template>
