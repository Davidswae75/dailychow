<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Chip from "@/components/utils/chip.vue";
import { ref } from "vue";

const options = [
  {
    label: "Eat Healthier",
    value: "eat_healthier",
  },
  {
    label: "Lose Weight",
    value: "lose_weight",
  },
  {
    label: "Maintain My Weight",
    value: "maintain_my_weight",
  },
  {
    label: "Gain Weight",
    value: "gain_weight",
  },
  {
    label: "Eat Nigerian Food",
    value: "eat_nigerian_food",
  },
  {
    label: "Spend Less On Food",
    value: "spend_less_on_food",
  },
];


const selection = ref("");
const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
}>();

const handleSelection = (select: string) => {
  selection.value = select;
  emit("update:modelValue", select);
};
</script>

<template>
  <main class="space-y-3">
    <HeaderText
      eyebrow="Question 1 of 5"
      title="What brings you here?"
      description="This shapes every pick we make for you."
    />

    <div class="flex gap-2 flex-wrap">
      <Chip
        v-for="o in options"
        :key="o.value"
        :variant="selection == o.value ? 'secondary': 'primary'"
        hover
        @click="handleSelection(o.value)"
        >{{ o.label }}</Chip
      >
    </div>
  </main>
</template>
