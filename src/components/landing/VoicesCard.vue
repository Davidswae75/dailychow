<script setup lang="ts">
import Reveal from '../utils/Reveal.vue';

const quotes = [
  {
    quote:
      "Every evening my husband and I did the same dance — 'what do you want?' 'anything.' Now one of us taps four times and we start cooking.",
    name: "Amaka",
    role: "Enugu, cooks for four",
  },
  {
    quote:
      "It told me to make ukwu ji and I hadn't thought of it in years. My mother laughed when I called her for the measurement.",
    name: "Tunde",
    role: "Lagos, learning to cook",
  },
  {
    quote:
      "I set my budget for the week and it stopped suggesting anything I couldn't afford. That alone was worth it.",
    name: "Halima",
    role: "Kano, student",
  },
];
</script>

<template>
  <section class="grid md:grid-cols-3 gap-5 mt-10">
    <Reveal
    once
    :delay="(i * 0.2)"
      class="border-muted/15 border-t py-6 space-y-3"
      v-for="(card, i) in quotes"
      :key="card.name"
    >
      <p class="mt-3 text-cream font-bold font-text text-lg">
        {{ card.quote }}
      </p>
      <p class="text-xs text-cream">
        <span class="font-bold">{{ card.name }}</span
        > - {{ card.role }}
      </p>
    </Reveal>
  </section>
</template>
