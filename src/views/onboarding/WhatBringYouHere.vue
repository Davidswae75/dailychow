<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Chip from "@/components/utils/chip.vue";


const options = [

  { label: "Eat Healthier", value: "eat_healthier" },
  { label: "Lose Weight", value: "lose_weight" },
  { label: "Maintain My Weight", value: "maintain_my_weight" },
  { label: "Gain Weight", value: "gain_weight" },
  { label: "Eat Nigerian Food", value: "eat_nigerian_food" },
  { label: "Spend Less On Food", value: "spend_less_on_food" },
];

const model = defineModel<string>({ default: "eat_healthier" });
const isSelected = (value: string) => model.value === value;

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
        variant="primary"
        hover
        :active="isSelected(o.value)"
        @click="model = o.value"
      >
        <!-- Text on top -->
        <span class="relative z-10">{{ o.label }}</span>
      </Chip>
    </div>
  </main>
</template>
