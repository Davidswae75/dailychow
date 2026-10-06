<script setup lang="ts">
import { computed } from "vue";

type Direction = "up" | "down" | "left" | "right";

interface DarkShadeProps {
  direction?: Direction;
}

const props = withDefaults(defineProps<DarkShadeProps>(), {
  direction: "up",
});

const getDirection = computed(() => {
  switch (props.direction) {
    case "up":
      return "bg-linear-to-t";
    case "down":
      return "bg-linear-to-b";
    case "left":
      return "bg-linear-to-l";
    case "right":
      return "bg-linear-to-r";
    default:
      return "bg-linear-to-l";
  }
});
</script>

<template>
  <div
    :class="getDirection"
    class="bg-linear-to-t from-charcoal/55 to-charcoal/0 z-10 absolute inset-0 top-0 bottom-0"
  ></div>
</template>
