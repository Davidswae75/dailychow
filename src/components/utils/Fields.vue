<script setup lang="ts">
import Input, { type InputProps } from "../ui/input/Input.vue";
import { getNestedValue, setNestedValue } from "@/utils";
import type { HTMLAttributes } from "vue";

interface SecondLabel {
  label: string;
  labelClass?: HTMLAttributes["class"];
  labelAction?: () => void;
}

type InputField = {
  fieldType: "input";
  label: string;
  labelClass?: string;
  secondLabel?: SecondLabel;
} & InputProps 

export interface FieldsProp {
  fields: InputField[];
  form: Record<string, any>;
}

const props = defineProps<FieldsProp>();
</script>

<template>
  <main>
    <div v-for="f in fields" :key="f.fieldType" class="">
      <div class="flex justify-between items-end mb-0">
        <label
          :class="f.labelClass"
          class="text-base font-bold font-text text-charcoal"
          >{{ f.label }}</label
        >
        <label
          :class="f.secondLabel?.labelClass"
          @click="f.secondLabel?.labelAction?.()"
          class="text-sm font-bold font-text text-terracotta"
          >{{ f.secondLabel?.label }}</label
        >
      </div>
      <Input
        v-bind="{ ...f }"
        :model-value="getNestedValue(form, f.name)"
        @update:model-value="(val) => setNestedValue(form, f.name, val)"
        :name="f.name"
        v-if="f.fieldType === 'input'"
        :attrs="f.attrs"
        class="my-1.5"
      >
        <template #append-icon v-if="$slots[`${f.name}:append-icon`]">
          <slot :name="`${f.name}:append-icon`" />
        </template>
      </Input>
    </div>
  </main>
</template>
