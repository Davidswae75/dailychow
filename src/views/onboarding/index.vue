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
import Register from "../auth/Register.vue";
import { AnimatePresence, motion } from "motion-v";

const currentStep = ref(1);
const steps = ref(5);

const profilePreference = reactive({
  interests: "eat_healthier",
  notInterested: {
    dietaryNeeds: ["vegetarian"],
    pepperLevel: "mild",
  },
  bodyType: {
    id: "lean",
    name: "Lean & Thin",
    category: "Lean",
    description: "Naturally slim. Hard to put on weight or muscle.",
  } as BodyType,
  foodType: [
    {
      id: "jollof-rice",
      name: "Jollof Rice",
      category: "Rice",
      description: "Classic party rice in tomato-pepper sauce",
    },
  ] as FoodType[],
});
</script>

<template>
  <main class="bg-cream grain">
    <section class="mx-auto max-w-2xl">
      <OContainer :current-step="currentStep" :steps="steps">
        <template #content>
        <AnimatePresence mode="popLayout" >
          <motion.div
          :key="currentStep"
          :initial="{ scale: 0.9, filter: 'blur(50px)'}"
          :animate="{ scale: 1, filter: 'blur(0px)' }"
          :exit="{ scale:0.9, filter: 'blur(50px)' }"
          :transition="{
            duration: 0.4,
            delay: 0.1
          }"
        >
          <WhatBringYouHere
            v-if="currentStep == 1"
            v-model="profilePreference.interests"
          />
          <NotInterested
            v-else-if="currentStep == 2"
            v-model="profilePreference.notInterested"
          />
          <BodyTypes
            v-else-if="currentStep == 3"
            v-model="profilePreference.bodyType"
          />
          <FoodTypes
            v-else-if="currentStep == 4"
            v-model="profilePreference.foodType"
          />
          <Register
           v-else-if="currentStep == 5"
            v-model="profilePreference.foodType"
          />
        </motion.div>
        </AnimatePresence>
        </template>
        <template #footer>
          <div
            class="flex justify-between item-center sticky bottom-0 py-4 bg-cream grain z-30"
          >
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
