<script setup lang="ts">
import { computed } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(defineProps<{ name?: string | null; size?: "sm" | "md" | "lg"; class?: string }>(), {
  size: "md",
});

const initial = computed(() => (props.name?.trim()?.[0] ?? "?").toUpperCase());
const sizes = { sm: "size-9 text-sm", md: "size-11 text-base", lg: "size-14 text-xl" };
</script>

<template>
  <span
    :class="cn('grid shrink-0 place-items-center rounded-full bg-saffron font-bold text-charcoal', sizes[size], props.class)"
    aria-hidden="true"
  >
    {{ initial }}
  </span>
</template>
