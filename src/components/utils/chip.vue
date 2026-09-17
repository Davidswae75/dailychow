<script lang="ts" setup>
import { motion } from "motion-v";
import type { Component } from "vue";

const presets = {
  primary: "bg-card/90 shadow-soft border-terracotta/20 border text-ink font-weight-medium *:stroke-terracotta",
  secondary:
    "bg-terracotta text-cream font-weight-medium border border-border",
  accent: "bg-olive text-cream font-weight-medium",
};

interface Props {
  variant?: keyof typeof presets;
  icon?: Component;
  iconClass?: string
  hover?: boolean
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
});

</script>

<template>
  <div
    class="rounded-4xl py-2 px-3.5  text-xs tracking-wider inline-flex gap-2 items-center transition-all relative"
    :class="[presets[variant], hover && 'hover:border-terracotta/60 cursor-pointer!', active && 'text-cream!']"
  >
    <component v-if="icon" :is="icon" class="size-4" :class="iconClass"/>
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
    <slot/>
    </div>
</template>