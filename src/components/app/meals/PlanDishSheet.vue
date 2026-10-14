<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Button from "@/components/ui/button/Button.vue";
import OptionGroup from "../common/OptionGroup.vue";
import { useMealsStore } from "@/store";
import { useScreenSize } from "@/hooks";
import { addDays, shortWeekday, toDateKey } from "@/lib/dates";
import { mealOptions, type Option } from "@/lib/options";
import type { Dish, MealTime } from "@/lib/dishes";

/** Plan one known dish: choose a day this week and a meal slot. */
const props = defineProps<{ dish: Dish }>();
const open = defineModel<boolean>("open", { default: false });

const meals = useMealsStore();
const { smallerThan } = useScreenSize();

const nextSevenDays = computed(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i)));

/** Days as chip options; "Today"/"Tomorrow" read better than dates. */
const dayOptions = computed<Option[]>(() =>
  nextSevenDays.value.map((date, i) => ({
    value: toDateKey(date),
    label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${shortWeekday(date)} ${date.getDate()}`,
  }))
);

const slotOptions = computed(() => mealOptions.filter((o) => props.dish.mealTimes.includes(o.value)));

const day = ref(toDateKey(new Date()));
const slot = ref<MealTime>("dinner");
const saving = ref(false);

watch(open, (isOpen) => {
  if (!isOpen) return;
  day.value = toDateKey(new Date());
  slot.value = slotOptions.value[0]?.value ?? "dinner";
});

async function save() {
  const date = nextSevenDays.value.find((d) => toDateKey(d) === day.value) ?? new Date();
  saving.value = true;
  try {
    await meals.planMeal(date, slot.value, props.dish.id);
    open.value = false;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent
      :side="smallerThan('md') ? 'bottom' : 'right'"
      class="gap-0 rounded-t-[34px] bg-cream md:min-w-[28rem] md:rounded-none"
    >
      <SheetHeader class="px-5 pt-6 pb-3">
        <SheetDescription class="text-sm font-bold text-terracotta-deep">Add to planner</SheetDescription>
        <SheetTitle class="font-display text-2xl">{{ dish.name }}</SheetTitle>
      </SheetHeader>
      <div class="flex flex-col gap-6 px-5 pb-6">
        <OptionGroup v-model="day" label="Which day?" :options="dayOptions" />
        <OptionGroup v-model="slot" label="Which meal?" :options="slotOptions" />
        <Button size="xl" block="full" variant="deep" :loading="saving" @click="save">
          Add to planner
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
