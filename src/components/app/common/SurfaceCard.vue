<script setup lang="ts">
import { cn } from "@/lib/utils";

/** The paper card every dashboard section sits on. */
const props = withDefaults(defineProps<{ as?: string; class?: string; padded?: boolean }>(), {
  as: "section",
  padded: true,
});
</script>

<template>
  <component
    :is="as"
    :class="cn('grain rounded-[26px] border border-border bg-paper', padded && 'p-5', props.class)"
  >
    <slot />
  </component>
</template>
