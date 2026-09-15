<script setup lang="ts">
import Reveal from "../utils/Reveal.vue";

const reasons = [
  {
    title: "It ends the decision, it doesn't add to it",
    body: "One dish, named. Not a grid of two hundred recipes for you to compare while your hunger turns into irritation. If you don't like the answer, one tap gives you the next best fit.",
  },
  {
    title: "It rotates you through food you'd forgotten",
    body: "Naija Plate remembers what you ate this week and deliberately steers you elsewhere. In a month you will have cooked things you last had at your grandmother's house.",
  },
  {
    title: "It respects your money and your minutes",
    body: "Set a budget in naira and the minutes you actually have. Every suggestion fits both, with the market list and a rough cost so nothing surprises you at the stall.",
  },
  {
    title: "It is built for Nigerian food, only",
    body: "Not a foreign recipe app with one jollof entry added. Real measures — cups, derica, wraps, bunches — real local names, real substitutes when an ingredient is out of season.",
  },
];
</script>

<template>
  <Reveal
    once
    class="py-6 space-y-3"
    v-for="(card, i) in reasons"
    :key="card.title"
    :direction="(i + 1) % 2 == 0 ? 'left' : 'right'"
  >
    <h3 className="mt-3 flex items-baseline gap-3 text-2xl">
      <span className="font-text text-saffron text-3xl">0{{ i + 1 }}</span>
      {{ card.title }}
    </h3>
    <p class="mt-3 text-muted-foreground">{{ card.body }}</p>
  </Reveal>
</template>
