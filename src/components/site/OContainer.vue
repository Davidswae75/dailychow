<script setup lang="ts">
import StepBar from "../utils/StepBar.vue";
import Logo from "./Logo.vue";

interface Props {

  currentStep?: number;
  steps?: number
}

withDefaults(defineProps<Props>(), {
  currentStep: 0,
  steps: 0
})
</script>

<template>
  <main class="bg-transparent py-3 md:py-5 px-5 md:px-8 min-h-screen relative  flex flex-col justify-between">
    <slot name="header">
      <div class="flex justify-between items-center sticky top-0 z-20 bg-cream grain pt-4">
      <RouterLink to="/"><Logo /></RouterLink>
        <StepBar :current-step="currentStep" :steps="steps" />
      </div>
    </slot>

      <slot name="content" />

    <slot name="footer">
    
    </slot>
  </main>
</template>
