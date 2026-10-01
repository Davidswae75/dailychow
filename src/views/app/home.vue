<script setup lang="ts">
import jollof from "@/assets/ng-jollof.jpg";
import egusi from "@/assets/ng-egusi.jpg";
import suya from "@/assets/ng-suya.jpg";
import ofada from "@/assets/ng-ofada.jpg";
import moimoi from "@/assets/ng-moimoi.jpg";
import { computed, ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import VImg from "v-lazy-image";
const images = [jollof, egusi, suya, ofada, moimoi];

const count = ref(1);

const getImage = computed(() => images[count.value % images.length]);
</script>

<template>
  <main class="grid grid-cols-12 px-5 md:px-8 py-5 gap-3 *:rounded-2xl">
    <section
      class="h-64 col-span-12 flex flex-col justify-between md:col-span-8 border weave p-4 pl-3 relative overflow-clip -z-10 font-sans"
    >
      <p class="text-3xl font-black text-paper z-10">
        Your Food To Eat Today is <br />
        <span class="text-saffron text-5xl">Eba and Soup</span>
      </p>
      <div class="bottom-0 absolute z-[1000] ">
        <Button @click="count++" class="z" variant="accent">Show Full Details</Button>
      </div>
      <v-img
        :src="getImage"
        alt="joll0f"
        class="-z-70 object-cover size-65 md:size-75 lg:size-120 top-0 -right-6 absolute animate-float-slower"
      />
      <div
        class="bg-linear-to-l from-charcoal/50 to-charcoal/0 z-10 absolute inset-0 top-0"
      ></div>
      <div
        class="bg-linear-to-r from-terracotta-deep via-terracotta-deep via-50% to-terracotta/0 -z-10 absolute inset-0 top-0"
      ></div>
    </section>
    <div
      class="h-64 col-span-12 md:col-span-4 border bg-terracotta-deep weave"
    ></div>
    <div
      @click="count++"
      class="h-64 col-span-12 md:col-span-3 border bg-terracotta-deep weave"
    ></div>
    <div
      class="h-64 col-span-12 md:col-span-9 border bg-terracotta-deep weave"
    ></div>
  </main>
</template>
