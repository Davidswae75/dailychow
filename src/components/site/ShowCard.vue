<script setup lang="ts">
import jollof from "@/assets/ng-jollof.jpg";
import egusi from "@/assets/ng-egusi.jpg";
import suya from "@/assets/ng-suya.jpg";
import ofada from "@/assets/ng-ofada.jpg";
import moimoi from "@/assets/ng-moimoi.jpg";
import VImg from "v-lazy-image";
import { computed, ref } from 'vue';
import Button from "../ui/button/Button.vue";
import { Clock, ForkKnife } from "@lucide/vue";

const images = [jollof, egusi, suya, ofada, moimoi];

const count = ref(1);

const getImage = computed(() => images[count.value % images.length])
</script>

<template>
     <section
      class="min-h-52 border weave p-4 pl-3 relative overflow-clip font-sans transition-all"
    >
      <p class="text-2xl font-black text-paper z-[1000]">
        Your Food To Eat Today is <br />
        <span class="text-saffron text-5xl">Eba and Soup</span>
      </p>
      <p class="text-paper text-sm z-90 mt-2">
        Smoky rice with pepper base and soft Sunday energy
      </p>
      <div
        class="bottom-5 absolute w-full flex justify-between items-end pr-8 b"
      >
        <Button @click="count++" class="z" variant="accent"
          >Show Full Details</Button
        >
        <div
          class="text-cream flex items-center gap-2 border border-border px-2 py-0.5 rounded-3xl"
        >
          <span class="flex font-medium font-sans gap-px items-center text-sm"
            ><ForkKnife class="text-paper size-4" /> 2</span
          >
          <div class="h-5 w-px bg-paper"></div>
          <span class="flex font-medium font-sans gap-px items-center text-sm"
            ><Clock class="text-paper size-4" /> 1H</span
          >
        </div>
      </div>
      <v-img
        :src="getImage"
        alt="joll0f"
        class="-z-70 object-cover size-65 sm:size-90 md:size-75 lg:size-115 top-0 -right-6 absolute animate-float-slower"
      />
      <div
        class="bg-linear-to-l from-charcoal/55 to-charcoal/0 -z-10 absolute inset-0 top-0 bottom-0"
      ></div>
      <div
        class="bg-linear-to-r from-terracotta-deep via-terracotta-deep via-50% to-terracotta/0 -z-10 absolute inset-0 top-0"
      ></div>
    </section>
</template>