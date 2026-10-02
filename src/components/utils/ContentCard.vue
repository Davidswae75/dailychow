<script setup lang="ts">
import { cn } from "@/lib/utils";

interface Props {
  border?: boolean;
  eyebrow: string;
  title: string;
  class?: string;
}

const props = defineProps<Props>();

const cardClasses = cn(
  "bg-paper p-4 grain rounded-2xl space-y-5",
  props.border && "border border-border",
  props.class
);
</script>

<template>
  <section :class="cardClasses">
    <div>
      <p v-if="eyebrow" class="text-terracotta font-bold text-sm">
        {{ eyebrow }}
      </p>
      <p v-if="title" class="text-charcoal font-bold text-2xl font-display">
        {{ title }}
      </p>
    </div>

    <slot />
  </section>
</template>
