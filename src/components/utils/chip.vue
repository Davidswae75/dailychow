<script lang="ts" setup>
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
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
});

</script>

<template>
  <div
    class="rounded-4xl py-2 px-3.5  text-xs tracking-wider inline-flex gap-2 items-center transition-all"
    :class="[presets[variant], hover && 'hover:border-terracotta/60 cursor-pointer!']"
  >
    <component v-if="icon" :is="icon" class="size-4" :class="iconClass"/>
    <slot />
  </div>
</template>