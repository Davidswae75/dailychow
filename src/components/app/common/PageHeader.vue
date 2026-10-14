<script setup lang="ts">
defineProps<{
  title: string;
  eyebrow?: string;
  description?: string;
}>();
</script>

<template>
  <header class="flex flex-wrap items-end justify-between gap-4">
    <div class="max-w-2xl space-y-2">
      <p v-if="eyebrow" class="text-sm text-ink">{{ eyebrow }}</p>
      <h1 class="text-3xl md:text-4xl font-bold text-charcoal">{{ title }}</h1>
      <p v-if="description" class="text-sm md:text-base text-muted-foreground">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>
