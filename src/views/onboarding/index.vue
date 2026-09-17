<script setup lang="ts">
import OContainer from "@/components/site/OContainer.vue";
import WhatBringYouHere from "./WhatBringYouHere.vue";
import NotInterested from "./NotInterested.vue";
import { reactive, ref } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { ArrowLeft, ArrowRight } from "@lucide/vue";
import BodyTypes from "./BodyTypes.vue";
import type { BodyType } from "@/types";
import FoodTypes from "./FoodTypes.vue";
import type { FoodType } from "@/types/FoodTypes";


const currentStep = ref(1);
const steps = ref(4);

const profilePreference = reactive({
  interests: "eat_healthier",
  notInterested: {
    dietaryNeeds: ['vegetarian'],
    pepperLevel: 'mild',
  },
  bodyType: {
    id: "lean",
    name: "Lean & Thin",
    category: "Lean",
    description: "Naturally slim. Hard to put on weight or muscle."
  } as BodyType,
  foodType:{
    id: "",
    name: "",
    category: "Rice",
    description: ""
  } as FoodType
});
</script>

<template>
  <main class="bg-cream grain">
    <section class="mx-auto max-w-2xl">
      <OContainer :current-step="currentStep" :steps="steps">
        <template #content>
          <WhatBringYouHere
            v-if="currentStep == 1"
            v-model="profilePreference.interests"
            />
          <NotInterested
            v-else-if="currentStep == 2"
            v-model="profilePreference.notInterested"
          />
          <BodyTypes v-else-if="currentStep == 3" v-model="profilePreference.bodyType"/>
          <FoodTypes v-else-if="currentStep == 4" v-model="profilePreference.foodType"/>
        </template>
        <template #footer>
          <div class="flex justify-between item-center sticky bottom-0 pb-6 bg-cream grain z-30">
            <Button
              class="flex items-center"
              @click="currentStep -= 1"
              variant="link"
              v-if="currentStep != 1"
              ><ArrowLeft /> Back</Button
            >
            <div v-else></div>
            <Button
              class="flex items-center"
              v-if="currentStep != steps"
              @click="currentStep += 1"
              variant="terracotta"
            >
              Continue <ArrowRight
            /></Button>
            <div v-else></div>
          </div>
        </template>
      </OContainer>
    </section>
  </main>
</template>
