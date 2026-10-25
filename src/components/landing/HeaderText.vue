<script setup lang="ts">
import { cn } from '@/lib';

interface Props {
  eyebrow: string;
  title: string;
  description?: any;
  reduceWidth?: boolean;
  titleClass?: string;
  /** Closing phrase of the title, set in serif italic */
  accent?: string;
  accentClass?: string;
}

defineProps<Props>();
</script>

<template>
  <div class="space-y-3" :class="{ 'md:w-3/5': reduceWidth }">
    <p class="text-terracotta uppercase text-base">{{ eyebrow }}</p>
    <p :class="cn('text-charcoal text-3xl md:text-5xl font-bold font-text', titleClass)">
      {{ title }}
      <span v-if="accent" :class="cn('accent-italic', accentClass)">{{ accent }}</span>
    </p>
    <p v-if="description" class="text-muted-foreground text-sm">{{ description }}</p>
    <template v-else-if="$slots['description']">
      <slot name="description" />
    </template>
  </div>
</template>
