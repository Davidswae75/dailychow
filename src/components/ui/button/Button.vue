<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import type { ButtonVariants } from ".";
import { Primitive } from "reka-ui";
import { cn } from "@/lib";
import { buttonVariants } from ".";
import { Loader2 } from "@lucide/vue";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  rounded?: ButtonVariants["rounded"];
  block?: ButtonVariants["block"];
  class?: HTMLAttributes["class"];
  to?: string;
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  loading: false
});
</script>

<template>
  <RouterLink
    v-if="to && !loading"
    :to="to"
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :data-block="block"
    :data-rounded="rounded"
    :class="cn(buttonVariants({ variant, size, block, rounded }), props.class)"
  >
    <slot />
  </RouterLink>
  <Primitive
    v-else
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :data-block="block"
    :data-rounded="rounded"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size, block, rounded }), props.class, loading && 'opacity-70 pointer-events-none')"
  >
    <template v-if="loading">
     <div class="flex gap-2 items-center">
      <!-- <slot/>   -->
        <Loader2 class="animate-spin" />
     </div>
    </template>
    <template v-else><slot /></template>
  </Primitive>
</template>
