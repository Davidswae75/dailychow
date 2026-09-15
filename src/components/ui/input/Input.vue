<script setup lang="ts">
import { toRef, type HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/lib/utils";
import { useField } from "vee-validate";

export type BaseInput = {
  attrs: Partial<HTMLInputElement>;
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
  meta,
} = useField(name, undefined, {
  initialValue: props.defaultValue,
});

const handleInput = (e: InputEvent) => {
  const value = (e.target as HTMLInputElement).value;
  
  emits("update:modelValue", value);
  handleChange(e)
};
</script>

<template>
  <div class="w-full space-y-">
    <div class="relative w-full">
      <input
        v-bind="{ ...attrs }"
        :name="name"
        class="w-full transition-all"
        :class="
          cn(
            'h-12 rounded-full border border-line outline-0 w-64 px-5 bg-cream placeholder:text-sm',
            'focus:ring-terracotta focus:border-none focus:ring',
            $slots['append-icon'] ? 'pr-14' : '',
            inputClass
          )
        "
        :value="inputValue"
        @input="handleInput"
        @blur="handleBlur"
      />
      <div v-if="$slots['append-icon']" class="absolute right-6 top-3 ">
        <slot name="append-icon" />
      </div>
      <p class="text-red-500 text-sm animate__animated animate__headShake text-center pt-1.5" v-if="errorMessage">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<!-- const modelValue = useVModel(props, "modelValue", emits, {
   passive: true,
   defaultValue: props.defaultValue,
  }) -->

<!-- <input
  v-model="modelValue"
> -->
<!-- data-slot="input"
:class="cn(
  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  props.class,
)" -->
