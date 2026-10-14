<script setup lang="ts" generic="V extends string">
/**
 * A labelled set of chips. Single choice by default (radio behaviour with the
 * sliding highlight); pass `multiple` for checkbox behaviour.
 */
import { computed, useId } from "vue";
import Chip from "@/components/utils/chip.vue";
import type { Option } from "@/lib/options";

const props = defineProps<{
  label: string;
  options: readonly Option<V>[];
  multiple?: boolean;
  /** Small muted text after the label, e.g. "pick any" */
  hint?: string;
}>();

const model = defineModel<V | V[]>({ required: true });

// Each group needs its own id so its highlight doesn't slide into another group
const layoutId = `option-${useId()}`;

const selected = computed(() => (Array.isArray(model.value) ? model.value : [model.value]));
const isSelected = (value: V) => selected.value.includes(value);

function choose(value: V) {
  if (!props.multiple) {
    model.value = value;
    return;
  }
  const current = selected.value;
  model.value = isSelected(value) ? current.filter((v) => v !== value) : [...current, value];
}
</script>

<template>
  <fieldset class="space-y-2.5">
    <legend class="mb-2.5 text-sm font-semibold text-charcoal">
      {{ label }}
      <span v-if="hint" class="font-normal text-ink">· {{ hint }}</span>
    </legend>
    <div class="flex flex-wrap gap-2" :role="multiple ? 'group' : 'radiogroup'" :aria-label="label">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        :role="multiple ? undefined : 'radio'"
        :aria-checked="multiple ? undefined : isSelected(option.value)"
        :aria-pressed="multiple ? isSelected(option.value) : undefined"
        class="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-deep"
        @click="choose(option.value)"
      >
        <Chip
          v-if="!multiple"
          hover
          :active="isSelected(option.value)"
          :layout-id="layoutId"
          class="text-sm! tracking-normal!"
        >
          <span class="relative z-20">{{ option.label }}</span>
        </Chip>
        <Chip
          v-else
          hover
          :variant="isSelected(option.value) ? 'accent' : 'primary'"
          class="text-sm! tracking-normal!"
        >
          <span class="relative z-20">{{ option.label }}</span>
        </Chip>
      </button>
    </div>
  </fieldset>
</template>
