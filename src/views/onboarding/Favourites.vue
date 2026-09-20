<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import dodo from "@/assets/ng-dodo.jpg";
import jollof from "@/assets/ng-jollof.jpg";
import egusi from "@/assets/ng-egusi.jpg";
// import puff_puff from "@/assets/ng-puff_puff.jpg";
import suya from "@/assets/ng-suya.jpg";
import akara from "@/assets/ng-akara.jpg";
import moi_moi from "@/assets/ng-moimoi.jpg";
// import nkwobi from "@/assets/ng-nkwobi.jpg";
// import abacha from "@/assets/ng-abacha.jpg";
// import amala from "@/assets/ng-amala.jpg";
import ofada_rice from "@/assets/ng-ofada.jpg";
import pepper_soup from "@/assets/ng-peppersoup.jpg";
import { CheckCircle } from "@lucide/vue";
import type { FoodType } from "@/types/FoodTypes";

const favourites = [
  { id: "dodo", name: "Dodo", image: dodo, category: "Snack" },
  { id: "jollof_rice", name: "Jollof Rice", image: jollof, category: "Main Dish" },
  { id: "egusi_soup", name: "Egusi Soup", image: egusi, category: "Soup" },
  // { id: "puff_puff", name: "Puff Puff", image: puff_puff, category: "Snack" },
  { id: "suya", name: "Suya", image: suya, category: "Grill" },
  { id: "akara", name: "Akara", image: akara, category: "Snack" },
  { id: "moi_moi", name: "Moi Moi", image: moi_moi, category: "Side Dish" },
  // { id: "nkwobi", name: "Nkwobi", image: nkwobi, category: "Delicacy" },
  // { id: "abacha", name: "Abacha", image: abacha, category: "Salad" },
  // { id: "amala", name: "Amala", image: amala, category: "Main Dish" },
  { id: "ofada_rice", name: "Ofada Rice", image: ofada_rice, category: "Main Dish" },
  { id: "pepper_soup", name: "Pepper Soup", image: pepper_soup, category: "Soup" },
];


const model = defineModel<FoodType[]>({
  default: () => ([])
})

const isSelected = (id: string) => {
  return model.value.find(m => m.id == id)
}

const handleSelection = (item: FoodType) => {
  const findID = model.value.find(m => m.id === item.id)

  if(findID) model.value = model.value.filter(m => m.id != item.id)
  else model.value = [...model.value, item]
}

</script>

<template>
  <main class="space-y-3 p-1">
    <HeaderText
      eyebrow="Quetion 5 of 5"
      title="Pick a few old favourites"
      description="Tap any you love — we'll keep them in the rotation."
    />

    <section class="grid grid-cols-3 gap-3">
      <div @click="handleSelection(f)" :class="!!isSelected(f.id) && 'border-2 border-terracotta'" class="h-32 transition-all md:h-60 w-full rounded-3xl overflow-hidden relative" v-for="f in favourites" :key="f.id">
        <div class="bg-linear-to-t from-charcoal/50 to-charcoal/0 z-10 absolute inset-0 top-0"></div>
        <CheckCircle v-show="!!isSelected(f.id)" class="absolute top-3 right-3 bg-terracotta rounded-full p-1 size-5 md:size-6 z-50 text-cream"/>
        <img :src="f.image" class="object-cover h-full w-full absolute inset-0" />
        <p class="p-2 text-xs md:font-medium text-cream z-50 absolute bottom-0">{{ f.name }}</p>
      </div>
    </section>
  </main>
</template>
