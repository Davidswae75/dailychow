<script setup lang="ts">
interface Props {
  steps: number;
  currentStep: number;
}

defineProps<Props>();
</script>

<template>
  <div class="flex items-center gap-1">
    <span
      v-for="n in steps"
      :key="n"
      class="size-1.5 rounded-full transition-all bg-muted-foreground/25"
      :class="[n == currentStep && 'w-5 bg-terracotta', currentStep > n && 'bg-terracotta/25']"
    ></span>
  </div>
</template>
