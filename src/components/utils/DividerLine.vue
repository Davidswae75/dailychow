<script setup lang="ts">
import { cn } from "@/lib";
import { computed } from "vue";

interface Props {
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  color: "border",
});

const borderColor = computed(() => cn("border-" + props.color));

</script>

<template>
  <div :class="['border-[0.2px]', borderColor]" />
</template>
