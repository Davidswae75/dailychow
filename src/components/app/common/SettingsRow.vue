<script setup lang="ts">
import { ChevronRight } from "@lucide/vue";

/** One row in a settings list. Emits `select` when tapped. */
defineProps<{ label: string; value?: string }>();
defineEmits<{ select: [] }>();
</script>

<template>
  <button
    type="button"
    class="flex min-h-14 w-full items-center gap-3 border-b border-border px-4 text-left last:border-b-0 transition-colors hover:bg-cream/60"
    @click="$emit('select')"
  >
    <slot name="icon" />
    <span class="grow text-[15px] font-medium text-charcoal">{{ label }}</span>
    <span v-if="value" class="max-w-[55%] truncate text-sm text-ink">{{ value }}</span>
    <ChevronRight class="size-4 shrink-0 text-ink" />
  </button>
</template>
