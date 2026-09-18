<script setup lang="ts">
import { toRef, type HTMLAttributes, type InputHTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { useField } from "vee-validate";

export type BaseInput = {
  attrs?: InputHTMLAttributes;
};

export type InputProps = {
  defaultValue?: string | number;
  modelValue?: any;
  inputClass?: HTMLAttributes["class"];
  name: string;
} & BaseInput;

const props = defineProps<InputProps>();

const name = toRef(props, "name");

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
} = useField(name, undefined, {
  initialValue: props.defaultValue,
});

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  emits("update:modelValue", value);
  handleChange(e);
};
</script>

<template>
  <div class="w-full">
    <div class="relative w-full">
      <input
        v-bind="{ ...(attrs || {}), capture: undefined }"
        :name="name"
        :value="inputValue"
        class="w-full transition-all"
        :class="
          cn(
            'h-12 rounded-full border border-line outline-0 text-charcoal w-64 px-5 bg-cream placeholder:text-sm placeholder:text-muted-foreground text-base caret-terracotta',
            'focus:ring-terracotta focus:border-none focus:ring',
            $slots['append-icon'] ? 'pr-14' : '',
            inputClass
          )
        "
        @input="handleInput"
        @blur="handleBlur"
      />
      <div v-if="$slots['append-icon']" class="absolute right-6 top-3">
        <slot name="append-icon" />
      </div>
      <p
        v-if="errorMessage"
        class="text-red-500 text-sm animate__animated animate__headShake text-center pt-1.5"
      >
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>