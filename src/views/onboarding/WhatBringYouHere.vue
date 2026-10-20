<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Chip from "@/components/utils/chip.vue";
import { goalOptions } from "@/lib";


const options = goalOptions;

const model = defineModel<string>({ default: "eat_healthier" });
const isSelected = (value: string) => model.value === value;

</script>

<template>
  <main class="space-y-3">
    <HeaderText
      eyebrow="Question 1 of 4"
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
