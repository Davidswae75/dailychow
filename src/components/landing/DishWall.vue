<script setup lang="ts">
import HeaderText from "./HeaderText.vue";

import jollof from "@/assets/ng-jollof.jpg";
import egusi from "@/assets/ng-egusi.jpg";
import suya from "@/assets/ng-suya.jpg";
import ofada from "@/assets/ng-ofada.jpg";
import moimoi from "@/assets/ng-moimoi.jpg";
import peppersoup from "@/assets/ng-peppersoup.jpg";
import akara from "@/assets/ng-akara.jpg";
import asun from "@/assets/ng-asun.jpg";
import dodo from "@/assets/ng-dodo.jpg";
import DishWallCard from "./DishWallCard.vue";

const dishes = [
  {
    img: jollof,
    name: "Party jollof",
    note: "Smoky, crowd food",
    tags: ["party", "45 min"],
  },
  {
    img: egusi,
    name: "Egusi & pounded yam",
    note: "Heavy, Sunday kind",
    tags: ["filling"],
  },
  {
    img: suya,
    name: "Suya",
    note: "Peppery, evening street",
    tags: ["quick", "buy"],
  },
  {
    img: ofada,
    name: "Ofada & ayamase",
    note: "Green, fiery, local rice",
    tags: ["spicy"],
  },
  {
    img: moimoi,
    name: "Moi moi",
    note: "Steamed beans, soft",
    tags: ["veg", "cheap"],
  },
  {
    img: peppersoup,
    name: "Goat pepper soup",
    note: "Light, clears the head",
    tags: ["light"],
  },
  {
    img: akara,
    name: "Akara & pap",
    note: "Morning food",
    tags: ["veg", "20 min"],
  },
  {
    img: asun,
    name: "Asun",
    note: "Smoked goat, peppered",
    tags: ["small chops"],
  },
  {
    img: dodo,
    name: "Dodo",
    note: "Sweet fried plantain",
    tags: ["veg", "quick"],
  },
];
</script>

<template>
  <main class="bg-cream overflow-hidden" id="dishes">
    <section class="standard_width">
      <HeaderText
        eyebrow="On the plate"
        title="Over 300 Nigerian dishes, from every corner of the country."
        description="Yoruba, Igbo, Hausa, Efik, Tiv, Ijaw and everything cooked in between — street food, Sunday food, market-day food, and the small things you snack on while the stew reduces."
        reduce-width
      />
    </section>
    <div class="marquee-mask">
      <div class="animate-marquee flex items-center w-max gap-4 pr-4">
        <DishWallCard
          v-for="(dish, index) in [...dishes, ...dishes]"
          :dish="dish"
          :key="dish.name"
          :index="index"
        />
      </div>

    </div>
    <!-- <div class="grid grid-cols-2 lg:grid-cols-4 w-max gap-4 mt-4 flex-wrap grid">
      <DishWallCard
        v-for="(dish, index) in dishes.slice(0,4)"
        :dish="dish"
        :key="dish.name"
        :index="index"
      />
    </div> -->
  </main>
</template>
