<script setup lang="ts" generic="T extends Record<string, any>">
import FilterFoods from "@/views/app/Foods/FilterFoods.vue";
import Button from "../ui/button/Button.vue";
import Sheet from "../ui/sheet/Sheet.vue";
import SheetClose from "../ui/sheet/SheetClose.vue";
import SheetContent from "../ui/sheet/SheetContent.vue";
import SheetDescription from "../ui/sheet/SheetDescription.vue";
import SheetFooter from "../ui/sheet/SheetFooter.vue";
import SheetHeader from "../ui/sheet/SheetHeader.vue";
import SheetTitle from "../ui/sheet/SheetTitle.vue";
import SheetTrigger from "../ui/sheet/SheetTrigger.vue";
import DividerLine from "./DividerLine.vue";

export interface Filter<T> {
  label: string;
  value: keyof T;
}

interface FilterProps<T> {
  filterKeys: Filter<T>[];
  items: T[];
}

const props = defineProps<FilterProps<T>>();
</script>

<template>
  <main class="transition-all">
    <Sheet>
      <SheetTrigger as-child>
        <Button variant="terracotta">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent class="w-full md:min-w-xl">
        <SheetHeader>
          <SheetTitle> This is the sheet title </SheetTitle>
          <SheetDescription> This is the sheet description </SheetDescription>
        </SheetHeader>
        <section class="space-y-2">
          <DividerLine color="green-500" />
         <FilterFoods v-for="f in filterKeys" :key="f.label" :items="items" :filter="f"/>
        </section>
        <SheetFooter>
          <SheetClose as-child>
            <Button> Close drawer </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </main>
</template>
