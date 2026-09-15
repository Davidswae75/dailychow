The user wants me to apply the SUGGESTED EDIT to the ORIGINAL CODE and output
ONLY the complete modified file, with no explanations.
<script setup lang="ts">
import {
  motion,
  type Variant,
  type Transition,
  type ViewportOptions,
} from "motion-v";

type Direction = "up" | "down" | "left" | "right" | "none";

interface Props {
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Only trigger animation once when entering viewport */
  once?: boolean;
  /** Direction the element enters from */
  direction?: Direction;
  /** Distance to travel in pixels */
  distance?: number;
  /** Viewport intersection threshold (0 1 or "some"/"all") */
  amount?: ViewportOptions["amount"];
  /** Full transition override */
  transition?: Transition;
  /** Override the starting state */
  initial?: Variant;
  /** Override the target/visible state */
  target?: Variant;
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0.2,
  duration: 0.6,
  once: false,
  direction: "up",
  distance: 20,
  amount: 0.2,
});

const getOffset = (dir: Direction): Partial<Variant> => {
  switch (dir) {
    case "up":
      return { y: props.distance };
    case "down":
      return { y: -props.distance, };
    case "left":
      return { x: props.distance };
    case "right":
      return { x: -props.distance };
    default:
      return {};
  }
};

// Base states
const initial: Variant = {
  opacity: 0,
  ...getOffset(props.direction),
  ...props.initial,
};

const target: Variant = {
  opacity: 1,
  x: 0,
  y: 0,
  ...props.target,
};

// Merged transition
const transition: Transition = {
  duration: props.duration,
  delay: props.delay,
  ease: [0.21, 0.92, 0.25, 1],
  ...props.transition,
};

// Viewport config only used when once=true
const viewport = props.once ? { once: true, amount: props.amount } : undefined;
</script>

<template>
  <motion.div
    :initial="initial"
    :animate="!once ? target : undefined"
    :while-in-view="once ? target : undefined"
    :transition="transition"
    :in-view-options="viewport"
  >
    <slot />
  </motion.div>

  <template> </template>
</template>
