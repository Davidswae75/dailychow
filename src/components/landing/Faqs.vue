<script lang="ts" setup>
import Accordion from "../ui/accordion/Accordion.vue";
import AccordionContent from "../ui/accordion/AccordionContent.vue";
import AccordionItem from "../ui/accordion/AccordionItem.vue";
import AccordionTrigger from "../ui/accordion/AccordionTrigger.vue";
import HeaderText from "./HeaderText.vue";

const faqs = [
  {
    q: "Is Naija Plate free?",
    a: "Yes. Telling it your mood and getting your daily dish is free. A small paid tier for full weekly meal plans and market lists is planned later.",
  },
  {
    q: "Is it only Nigerian food?",
    a: "Only. Over 300 dishes across Yoruba, Igbo, Hausa, Efik, Ijaw, Tiv and Nigerian street food, with the local names and measures people actually use.",
  },
  {
    q: "Can it work with what I already have at home?",
    a: "Yes. Tell it what's in the kitchen — a cup of beans, half a bag of rice, palm oil, some crayfish — and it will point you to what those can honestly become tonight.",
  },
  {
    q: "What about allergies, and food I don't touch?",
    a: "Set them once. Groundnut, seafood, offal, alcohol in cooking, or anything else you avoid, and no suggestion will ever include it.",
  },
  {
    q: "Does it handle budget in naira?",
    a: "It does. Enter a rough figure and every dish shows an estimated market cost for the number of people you're feeding.",
  },
  {
    q: "Do I need an account?",
    a: "Not for your first picks. An account only matters once you want your taste profile, saved dishes and cooking history kept across devices.",
  },
];
</script>

<template>
  <main class="bg-cream py-20 md:py-24" id="faqs">
    <section class="mx-auto max-w-4xl px-5 md:px-8 space-y-5">
      <HeaderText eyebrow="questions" title="Short answers, no long story." />

      <Accordion type="single" collapsible>
        <AccordionItem v-for="(f, index) in faqs" :key="f.a" :value="index.toString()">
            <AccordionTrigger class="text-left font-text text-lg">{{ f.q }}</AccordionTrigger>
            <AccordionContent class="text-base text-muted-foreground">{{ f.a }}</AccordionContent>
        </AccordionItem>

      </Accordion>
    </section>
  </main>
</template>
