<script setup lang="ts">
defineProps<{
  title: string;
  /** Optional link on the right, e.g. to the full list */
  link?: { to: string; label: string };
  /** Optional muted text on the right instead of a link */
  meta?: string;
}>();
</script>

<template>
  <div class="flex items-baseline justify-between gap-3">
    <h2 class="text-xl font-bold text-charcoal">{{ title }}</h2>
    <RouterLink
      v-if="link"
      :to="link.to"
      class="text-sm font-semibold text-terracotta-deep underline-offset-4 hover:underline"
    >
      {{ link.label }}
    </RouterLink>
    <span v-else-if="meta" class="text-sm text-ink">{{ meta }}</span>
  </div>
</template>
