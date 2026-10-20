<script lang="ts">
/**
 * How the onboarding top and bottom bars look:
 * - "classic": solid cream with the paper grain (the original look)
 * - "glass": frosted, see-through bars with rounded edges
 */
export type BarStyle = "classic" | "glass";

export const barClasses: Record<BarStyle, { header: string; footer: string }> = {
  classic: { header: "bg-cream grain", footer: "bg-cream grain" },
  glass: { header: "glass rounded-b-3xl px-3", footer: "glass rounded-t-3xl px-3" },
};
</script>

<script setup lang="ts">
import StepBar from "../utils/StepBar.vue";
import Logo from "./Logo.vue";

interface Props {
  currentStep?: number;
  steps?: number;
  barStyle?: BarStyle;
}

withDefaults(defineProps<Props>(), {
  currentStep: 0,
  steps: 0,
  barStyle: "classic",
});
</script>

<template>
  <main class="bg-transparent px-5 md:px-8 min-h-screen relative  flex flex-col justify-between items-center">
    <slot name="header">
      <div
        class="flex justify-between items-center sticky top-0 z-50 py-4 w-full"
        :class="barClasses[barStyle].header"
      >
      <RouterLink to="/"><Logo /></RouterLink>
        <StepBar :current-step="currentStep" :steps="steps" />
      </div>
    </slot>

    <div class="overflow-scroll">

      <slot name="content" />
    </div>

    <div class="w-full sticky bottom-0">
      <slot name="footer"/>
    </div>

  </main>
</template>
