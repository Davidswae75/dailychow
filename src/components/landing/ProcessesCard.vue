<script setup lang="ts">
import Reveal from "../utils/Reveal.vue";

const processes = [
  {
    label: "You talk",
    title: "Tell us the mood",
    body: "Heavy or light, peppery or mild, soup or rice, morning food or evening food. Four taps, plain language, no cooking jargon.",
  },
  {
    label: "We sift",
    title: "We filter what's real",
    body: "Your minutes, your budget in naira, what you ate the last three days, allergies, and whether you're cooking or buying from the closest bukka.",
  },
  {
    label: "You eat",
    title: "One dish, not a list",
    body: "A single confident answer with the ingredient list, the rough cost, the cooking time and two backups if the first one doesn't land.",
  },
];
</script>

<template>
  <section class="grid md:grid-cols-3 gap-5">
    <Reveal
      once
      class="border-line border-t py-6 space-y-3"
      v-for="(card, i) in processes"
      :key="card.label"
      :delay="i * 0.2"
    >
      <p class="text-xs font-medium tracking-widest text-olive uppercase">
        {{ card.label }}
      </p>
      <h3 className="mt-3 flex items-baseline gap-3 text-2xl">
        <span className="font-text text-saffron text-3xl">0{{ i + 1 }}</span>
        {{ card.title }}
      </h3>
      <p class="mt-3 text-muted-foreground">{{ card.body }}</p>
    </Reveal>
  </section>
</template>
