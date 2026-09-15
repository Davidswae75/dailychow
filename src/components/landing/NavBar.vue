<script lang="ts" setup>
import { CookingPot } from "@lucide/vue";
import { Button } from "../ui/button";
import { scrollPage } from "@/utils";

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
      <div class="flex gap-3 items-center">
        <div class="rounded-full bg-terracotta grid place-items-center p-2">
          <CookingPot class="size-5 stroke-olive-50" />
        </div>
        <span class="font-sans font-bold">Daily Bite</span>
      </div>
      <ul class="gap-4 hidden md:flex">
        <li v-for="link in navLinks" :key="link.title">
          <a
            @click="scrollPage(link.to)"
            class="font-sans text-sm text-ink"
            >{{ link.title }}</a
          >
        </li>
      </ul>

      <div class="flex item-center gap-1.5" >
        <Button to="/sign-in" variant="link">Sign In</Button>
        <Button
          class="rounded-3xl bg-terracotta hover:bg-terracotta-deep"
          variant="default"
          >Find tonight's dish</Button
        >
      </div>
    </nav>
  </header>
</template>
