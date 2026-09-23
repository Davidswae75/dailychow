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
  <main class="bg-transparent px-5 md:px-8 min-h-screen relative  flex flex-col justify-between items-center">
    <slot name="header">
      <div class="flex justify-between items-center sticky top-0 z-50 bg-cream grain py-4 w-full">
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
