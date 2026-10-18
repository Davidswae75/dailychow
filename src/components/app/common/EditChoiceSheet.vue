<script setup lang="ts">
import { ref, watch } from "vue";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Button from "@/components/ui/button/Button.vue";
import OptionGroup from "./OptionGroup.vue";
import { useScreenSize } from "@/composables/useScreenSize.ts";
import type { Option } from "@/lib";

/** Edit one preference in a sheet. Works on a draft; `save` gets the new value. */
const props = defineProps<{
  title: string;
  description?: string;
  options: Option[];
  value: string | string[];
  multiple?: boolean;
  saving?: boolean;
}>();
const open = defineModel<boolean>("open", { default: false });
const emit = defineEmits<{ save: [value: string | string[]] }>();
const { smallerThan } = useScreenSize();

const draft = ref<string | string[]>(props.value);
watch(open, (isOpen) => isOpen && (draft.value = Array.isArray(props.value) ? [...props.value] : props.value));
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent
      :side="smallerThan('md') ? 'bottom' : 'right'"
      class="gap-0 rounded-t-[34px] bg-cream md:min-w-[28rem] md:rounded-none"
    >
      <SheetHeader class="px-5 pt-6 pb-3">
        <SheetTitle class="font-display text-2xl">{{ title }}</SheetTitle>
        <SheetDescription v-if="description">{{ description }}</SheetDescription>
      </SheetHeader>
      <div class="flex flex-col gap-6 px-5 pb-6">
        <OptionGroup v-model="draft" :label="title" :options="options" :multiple="multiple" :hint="multiple ? 'pick any' : undefined" />
        <Button size="xl" block="full" variant="deep" :loading="saving" @click="emit('save', draft)">
          Save
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
