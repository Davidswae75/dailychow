<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import type { ButtonVariants } from ".";
import { Primitive } from "reka-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from ".";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  rounded?: ButtonVariants["rounded"];
  block?: ButtonVariants["block"];
  class?: HTMLAttributes["class"];
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :data-block="block"
    :data-rounded="rounded"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size, block, rounded }), props.class)"
  >
    <template v-if="to">
      <RouterLink :to="to">
        <slot />
      </RouterLink>
    </template>
    <template v-else><slot /></template>
  </Primitive>
</template>
