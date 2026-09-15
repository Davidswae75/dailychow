<script setup lang="ts">
import { scrollPage } from "@/utils";
import { CookingPot } from "@lucide/vue";
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
    title: "FAQ",
    to: "faq",
  },
];
</script>

<template>
  <main class="bg-cream">
    <section class="mx-auto py-16 max-w-6xl flex justify-between items-center">
      <div class="space-y-3">
        <div class="flex gap-2 items-center">
          <div class="bg-terracotta grid place-items-center rounded-full p-2">
            <CookingPot class="text-cream size-4" />
          </div>
          <p class="font-text text-xl font-bold">Daily Chow</p>
        </div>
        <p class="text-muted-foreground text-sm">
          One Nigerian dish, chosen for your mood, your minutes and your money.
        </p>
      </div>

      <div>
        <ul class="flex gap-4 items-center">
          <li v-for="nav in navLinks" :key="nav.title" @click="scrollPage(nav.to)">
            <a class="text-muted-foreground text-sm">{{ nav.title }}</a>
          </li>
        </ul>
      </div>
    </section>

    <div class="border-t py-6">
      <section class="mx-auto max-w-6xl">
        <p class="text-xs text-shadow-muted-foreground">
          © 2026 Naija Plate. Made for Nigerian kitchens.
        </p>
      </section>
    </div>
  </main>
</template>
