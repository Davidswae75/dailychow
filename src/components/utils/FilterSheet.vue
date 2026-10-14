<script setup lang="ts" generic="T extends Record<string, any>">
import { SlidersHorizontal } from '@lucide/vue';
import Button from '../ui/button/Button.vue';
import Sheet from '../ui/sheet/Sheet.vue';
import SheetClose from '../ui/sheet/SheetClose.vue';
import SheetContent from '../ui/sheet/SheetContent.vue';
import SheetDescription from '../ui/sheet/SheetDescription.vue';
import SheetFooter from '../ui/sheet/SheetFooter.vue';
import SheetHeader from '../ui/sheet/SheetHeader.vue';
import SheetTitle from '../ui/sheet/SheetTitle.vue';
import SheetTrigger from '../ui/sheet/SheetTrigger.vue';
import DividerLine from './DividerLine.vue';

export interface Filter<T> {
  label: string;
  value: keyof T & string;
}

interface FilterSheetProps<T> {
  filters: Filter<T>[];
  items: T[];
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<FilterSheetProps<T>>(), {
  title: 'Filters',
  description: '',
});

const emit = defineEmits<{
  (e: 'apply'): void;
  (e: 'reset'): void;
}>();

</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <slot name="trigger">
        <Button size="xl" variant="terracotta" class="inline-flex gap-1">Filters <SlidersHorizontal /></Button>
      </slot>
    </SheetTrigger>

    <SheetContent class="w-full md:min-w-[32rem]">
      <SheetHeader class="pt-4 pb-0">
        <SheetTitle>{{ title }}</SheetTitle>
        <SheetDescription v-if="description">
          {{ description }}
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-y-auto py-">
        <DividerLine color="green-500" />
        
        <div class="space-y-4 mt-4">
          <slot 
            name="filters" 
            :filters="filters" 
            :items="items" 
            />
          </div>
      </div>
      
      
      <DividerLine color="green-500" />
      <SheetFooter class="flex flex-row justify-end">
        <SheetClose as-child>
          <Button variant="ghost" @click="emit('reset')">
            Reset
          </Button>
        </SheetClose>
        <SheetClose as-child>
          <Button @click="emit('apply')" variant="secondary">
            Apply
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>