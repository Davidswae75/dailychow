<script lang="ts" setup>
import { Button } from "../ui/button";
import { scrollPage } from "@/utils";
import Logo from "../site/Logo.vue";

const navLinks = [
  {
    title: "The problem",
    to: "problem",
  },
  {
    title: "How it works",
    to: "how",
  },
  {
    title: "Dishes",
    to: "dishes",
  },
  {
    title: "Why Us",
    to: "why",
  },
  {
    title: "FAQs",
    to: "faqs",
  },
];


</script>

<template>
  <header
    class="h-16 bg-cream/90 inset-0 top-0 sticky border-b border-border z-100 px-5 md:px-8 backdrop-blur-md"
  >
    <nav class="mx-auto max-w-6xl flex justify-between h-full items-center">
      <Logo containerClass="shrink-0 whitespace-nowrap" />
      <ul class="gap-4 hidden md:flex">
        <li v-for="link in navLinks" :key="link.title">
          <a
            @click="scrollPage(link.to)"
            class="font-sans text-sm text-ink"
            >{{ link.title }}</a
          >
        </li>
      </ul>

      <div class="flex items-center gap-1.5 shrink-0">
        <Button to="/sign-in" variant="link" class="hidden sm:inline-flex">Sign In</Button>
        <Button
          to="/onboarding/registration"
          class="rounded-3xl bg-terracotta hover:bg-terracotta-deep whitespace-nowrap"
          variant="default"
          >Find tonight's dish</Button
        >
      </div>
    </nav>
  </header>
</template>
