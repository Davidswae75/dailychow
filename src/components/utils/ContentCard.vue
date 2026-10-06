<script setup lang="ts">
import { cn } from "@/lib/utils";
import Button from "../ui/button/Button.vue";
import type { Component } from "vue";

export interface BtnAction {
  label: string;
  action: () => void;
  icon?: Component;
  type?:
    | "default"
    | "accent"
    | "ghost"
    | "outline"
    | "secondary"
    | "terracotta"
    | "destructive";
}

interface Props {
  border?: boolean;
  eyebrow?: string;
  title?: string;
  description?: string;
  class?: string;
  actions?: BtnAction[];
  eyeIcon?: boolean;
  header?: boolean;
}

const props = defineProps<Props>();

const cardClasses = cn(
  "bg-paper p-4 grain rounded-2xl space-y-3",
  props.border && "border border-border",
  props.header && 'bg-cream',
  props.class
);
</script>

<template>
  <section :class="cardClasses">
    <div :class="[$slots['aside'] && 'flex justify-between items-center']">
      <div :class="[eyeIcon && 'flex items-center gap-2']">
        <p v-if="eyebrow && !eyeIcon" class="text-terracotta font-bold text-sm">
          {{ eyebrow }}
        </p>
        <p class="my-3 " v-else-if="$slots['eyebrow']"><slot name="eyebrow" /></p>
        <p v-if="title" class="text-charcoal font-bold text-2xl font-display" :class="header && 'md:text-5xl'">
          {{ title }}
        </p>
      </div>
      <div v-if="$slots['aside']">
        <slot name="aside" />
      </div>
    </div>
    <p v-if="description" class="text-muted-foreground text-sm font-sans">
     {{ description }}
    </p>

    <slot />

    <div class="flex mt-5 gap-2 flex-wrap" v-if="actions?.length">
      <Button
        v-for="a in actions"
        :key="a.label"
        @click="a.action()"
        :variant="a.type || 'default'"
        class="flex gap-px"
      >
        <component :is="a?.icon" class="size-4" /> {{ a.label }}
      </Button>
    </div>
  </section>
</template>
