<script lang="ts" setup>
import { motion } from "motion-v";
import type { Component } from "vue";
import { computed } from "vue";

const presets = {
  primary:
    "bg-card/90 shadow-soft border-terracotta/20 border text-ink font-weight-medium *:stroke-terracotta",
  secondary: "bg-terracotta text-cream font-weight-medium border border-border",
  accent: "bg-olive text-cream font-weight-medium",
};

type Type = 'navigation' | 'selection'

interface Props {
  variant?: keyof typeof presets;
  icon?: Component;
  iconClass?: string;
  hover?: boolean;
  active?: boolean;
  type?: Type;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  type: 'selection'
});

const types = computed(() => ({
  navigation : 'border-0 group no-underline! hover:bg-cream/100 bg-transparent shadow-none! *:text-muted-foreground cursor-pointer ' + presets[props.variant],
  selection: presets[props.variant]
}))
</script>

<template>
  <div
    class="rounded-full py-2 px-3.5 text-xs tracking-wider transition-all relative"
    :class="[
      types[type],
      hover && 'hover:border-terracotta/60 cursor-pointer!',
      active && 'text-cream!',
    ]"
  >
    <!-- Animated background -->
    <motion.span
      v-if="active"
      layout
      layout-id="selected-bg"
      class="absolute inset-0 rounded-full bg-terracotta"
      :transition="{
        type: 'spring',
        stiffness: 400,
        damping: 32,
      }"
    />
    
    
    <div class="flex items-center justify-center gap-3">
      <component v-if="icon" :is="icon" class="size-4" :class="iconClass"/>
      <slot/>
    </div>
  </div>
</template>
