<script lang="ts" setup>
import { computed } from "vue";

/** A dark overlay that fills its nearest positioned parent. */
type Direction = "top" | "bottom" | "left" | "right" | "full";

interface Props {
  /** Side the shade is darkest on. "full" is an even tint. */
  from?: Direction;
  /** Darkness at the strongest point, 0 to 1. */
  strength?: number;
}

const props = withDefaults(defineProps<Props>(), {
  from: "bottom",
  strength: 0.4,
});

const angles: Record<Exclude<Direction, "full">, string> = {
  top: "to bottom",
  bottom: "to top",
  left: "to right",
  right: "to left",
};

const background = computed(() => {
  const dark = `oklch(0.2 0.02 40 / ${props.strength})`;
  if (props.from === "full") return dark;
  return `linear-gradient(${angles[props.from]}, ${dark}, transparent)`;
});
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0"
    :style="{ background }"
    aria-hidden="true"
  />
</template>
